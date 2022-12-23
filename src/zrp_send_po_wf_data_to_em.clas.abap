CLASS zrp_send_po_wf_data_to_em DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.

    METHODS constructor .
    METHODS run_em_job
      IMPORTING
        !timestamp TYPE tzntstmpl .
  PROTECTED SECTION.
  PRIVATE SECTION.

    TYPES:
      BEGIN OF ty_workitem,
        wi_id  TYPE swwwihead-wi_id,
        tclass TYPE swwwihead-tclass,
      END OF ty_workitem .
    TYPES:
      ty_workitem_tab TYPE TABLE OF ty_workitem WITH EMPTY KEY .

    DATA:
      dest_name    TYPE c LENGTH 17 .
    DATA:
      auth_profile TYPE c LENGTH 15 .
    DATA:
      auth_conf    TYPE c LENGTH 25 .
    DATA oa2c_client TYPE REF TO if_oauth2_client .

    METHODS get_po_workflow_instances
      IMPORTING
        !timestamp       TYPE tzntstmpl
      RETURNING
        VALUE(workitems) TYPE ty_workitem_tab .
    METHODS generate_em_rest_client
      RETURNING
        VALUE(http_client) TYPE REF TO if_http_client .
    METHODS send_po_wf_task_to_em
      IMPORTING
        !http_client TYPE REF TO if_http_client
        !workitem    TYPE ty_workitem .
ENDCLASS.



CLASS ZRP_SEND_PO_WF_DATA_TO_EM IMPLEMENTATION.


METHOD constructor.

dest_name = 'EM_S4OP_US10_PO'.
auth_profile = '/IWXBE/MGW_MQTT'.
auth_conf = 'SCE_TEST'.

ENDMETHOD.


METHOD generate_em_rest_client.

cl_http_client=>create_by_destination(
                              EXPORTING  destination = dest_name
                              IMPORTING  client                   = http_client
                              EXCEPTIONS argument_not_found       = 1
                                         destination_not_found    = 2
                                         destination_no_authority = 3
                                         plugin_not_active        = 4
                                         internal_error           = 5
                                         OTHERS                   = 6 ).
http_client->propertytype_logon_popup = if_http_client=>co_disabled.
IF sy-subrc <> 0.
* Raise error and exception handling in case of instation of http_client failed
ENDIF.

**  Set token for authorization OAuth 2.0
TRY.
    cl_oauth2_client=>create( EXPORTING i_profile        = CONV #( auth_profile )
                                        i_configuration  = CONV #( auth_conf )
                              RECEIVING ro_oauth2_client = oa2c_client ).
  CATCH cx_oa2c.
* Raise error and exception handling in case of client creation failed for OAuth profile
ENDTRY.


TRY.
    oa2c_client->set_token( EXPORTING io_http_client = http_client ).

  CATCH cx_oa2c.
    TRY.
        CALL METHOD oa2c_client->execute_cc_flow.
      CATCH cx_oa2c.
* Raise error and exception handling in case of token set is failed
    ENDTRY.

    TRY.
        oa2c_client->set_token( EXPORTING io_http_client = http_client ).
      CATCH cx_oa2c.
* Raise error and exception handling in case of token set is failed
    ENDTRY.
ENDTRY.

DATA(request_headers) = VALUE tihttpnvp( ( name  = 'x-qos'
                                           value = '1' ) ).



** Set EM Rest API Call Endpoint
cl_http_utility=>set_request_uri( EXPORTING  request = http_client->request
                                             uri     = '/messagingrest/v1/queues/sap%2Fem%2Fs4%2Fpurchase-order/messages' ).

** Set request headers for the call if passed
LOOP AT request_headers ASSIGNING FIELD-SYMBOL(<header>).
  http_client->request->set_header_field( EXPORTING  name  = <header>-name
                                                        value = <header>-value ).
ENDLOOP.

http_client->refresh_cookie( ).

** Set Request Method (GET/POST/PATCH)
http_client->request->set_method( method = 'POST' ).




ENDMETHOD.


METHOD get_po_workflow_instances.

SELECT wi_id, tclass
INTO TABLE @workitems
FROM swwwihead
WHERE wi_rh_task = 'TS00800531'
AND wi_stat = @swfco_wi_status_ready
AND wi_type = @swfco_wi_normal
AND crea_tmp > @timestamp.

ENDMETHOD.


METHOD run_em_job.

  DATA(http_client) = generate_em_rest_client( ).

  DATA(workitems) = get_po_workflow_instances( timestamp = timestamp ).
  CHECK workitems IS NOT INITIAL.

  LOOP AT workitems ASSIGNING FIELD-SYMBOL(<workitem>).
    send_po_wf_task_to_em(
            http_client = http_client
            workitem    = <workitem> ).
  ENDLOOP.

ENDMETHOD.


METHOD send_po_wf_task_to_em.

    TYPES:
      BEGIN OF ty_wf_action,
        action_id   TYPE String,
        action_desc TYPE String,
      END OF ty_wf_action.
    TYPES ty_wf_actions TYPE TABLE OF ty_wf_action WITH DEFAULT KEY.
** Define the POST request body
    DATA:
      BEGIN OF po_wf_data,
        task_id       TYPE String,
        created_by    TYPE String,
        created_on    TYPE String,
        creater_email TYPE String,
        forward       TYPE String,
        priority      TYPE String,
        user_id       TYPE String,
        user_email    TYPE String,
        po_id         TYPE String,
        description   TYPE string,
        actions       TYPE ty_wf_actions,
      END OF po_wf_data,
      wi_agents        TYPE swrtwiagent,
      wi_object        TYPE swr_obj_2,
      workitem_details TYPE swr_widtl.

** Get the agent
    CALL FUNCTION 'SAP_WAPI_GET_WI_AGENTS'
      EXPORTING
        workitems = VALUE swrtwiid( ( workitem-wi_id ) )
      IMPORTING
        wi_agents = wi_agents.

** Get the basic workflow details
    SELECT SINGLE wi_id, wi_cruser, wfd_id, reference_nodeid, wi_text
          FROM swwwihead
          INTO @DATA(wi_head)
         WHERE wi_id = @workitem-wi_id.
    IF sy-subrc EQ 0.

**      SELECT  wi_id, wi_cruser, wfd_id, reference_nodeid, wi_text
**          FROM swwwihead
**          INTO TABLE @DATA(WI_ENTRY)
**         WHERE wi_id = @workitem-wi_id.

**      LOOP AT WI_ENTRY ASSIGNING FIELD-SYMBOL(<entry>).
**        po_wf_data-created_by =  <entry>-wi_cruser.
**      ENDLOOP.

      " Get the available decisions, this is based on the existing configuration
      " and will only work if the configuration is maintained in SPRO, path:
      " SAP Customizing Implementation Guid -> SAP Netweaver -> SAP Gateway Service Enablement -> Content ->
      " -> Workflow Settings -> Maintain Task Names and Decision Options
      " By default these entries will be filled from SAP, you need to do this if you have a custom workflow
      SELECT *
        FROM /iwwrk/c_wfdect
        INTO TABLE @DATA(decisions)
       WHERE workflow_id = @wi_head-wfd_id
         AND step_id = @wi_head-reference_nodeid
         AND langu = 'E'.
      LOOP AT decisions ASSIGNING FIELD-SYMBOL(<decision>).
        APPEND VALUE ty_wf_action( action_id = <decision>-altkey action_desc = <decision>-description ) TO po_wf_data-actions.
      ENDLOOP.
    ELSE.
      " TODO: should do better expection handling
      RETURN.
    ENDIF.

** Get the workflow approver email address
    DATA :
      messages TYPE bapiret2_t,
      address  TYPE bapiaddr3.

    CALL FUNCTION 'BAPI_USER_GET_DETAIL'
      EXPORTING
        username = CONV bapibname-bapibname( wi_agents[ 1 ]-user ) " Always an user is expected, should do better expection handling
      IMPORTING
        address  = address                 " Address Data
      TABLES
        return   = messages.                 " Return Structure

    po_wf_data-description = wi_head-wi_text.
    po_wf_data-task_id     = wi_head-wi_id.
    po_wf_data-user_id     = wi_agents[ 1 ]-user.
    po_wf_data-user_email  = address-e_mail.

** Get the Purchase Order Details from the workflow
    CALL FUNCTION 'SAP_WAPI_GET_OBJECTS'
      EXPORTING
        workitem_id      = workitem-wi_id
      IMPORTING
        leading_object_2 = wi_object.
   po_wf_data-po_id = wi_object-instid.

    DATA:
          po_number TYPE BAPIEKKO-PO_NUMBER,
          po_header TYPE BAPIEKKOL.
    po_number = po_wf_data-po_id.

    CALL FUNCTION 'BAPI_PO_GETDETAIL'
      EXPORTING
        purchaseorder = po_number
      IMPORTING
        po_header = po_header.
    po_wf_data-created_by = po_header-created_by.
    po_wf_data-created_on = po_header-created_on.

    CALL FUNCTION 'BAPI_USER_GET_DETAIL'
      EXPORTING
        username = CONV bapibname-bapibname( po_wf_data-created_by ) " Always an user is expected, should do better expection handling
      IMPORTING
        address  = address                 " Address Data
      TABLES
        return   = messages.                 " Return Structure
    po_wf_data-created_by = address-fullname.
    po_wf_data-creater_email = address-e_mail.
    po_wf_data-forward = address-e_mail.

** Get Task Created_On, Priority Data
    CALL FUNCTION 'SAP_WAPI_GET_WORKITEM_DETAIL'
      EXPORTING
        workitem_id     = workitem-wi_id
      IMPORTING
        workitem_detail = workitem_details.
    po_wf_data-priority = workitem_details-wi_priotext+2.

** Converting Date String
    CALL FUNCTION 'CONVERSION_EXIT_IDATE_OUTPUT'
      EXPORTING
        input  = po_wf_data-created_on
      IMPORTING
        output = po_wf_data-created_on.

** Serialize object into JSON String
    /ui2/cl_json=>serialize(
      EXPORTING
      data       = po_wf_data
      RECEIVING
      r_json     = DATA(json)
    ).

** Trigger the EM Rest API Post Message Call
    http_client->request->set_content_type( EXPORTING content_type = if_rest_media_type=>gc_appl_json ).

    http_client->request->set_version( if_http_request=>co_protocol_version_1_0  ).

    http_client->request->set_cdata( json ).

    http_client->send( EXCEPTIONS  http_communication_failure = 1
                                   http_invalid_state = 2
                                   http_processing_failed = 3
                                   http_invalid_timeout  = 4 ).
    IF sy-subrc <> 0.
      CALL METHOD http_client->get_last_error(
        IMPORTING
          message = DATA(errortext)
      ).
      WRITE: / 'communication_error( send )',
             / 'message: ', errortext.
** Raise error and exception handling if call is failed
    ENDIF.

** Fire Recieve call to fetch response from (http_client)

    http_client->receive( EXCEPTIONS http_communication_failure = 1
                                     http_invalid_state         = 2
                                     http_processing_failed     = 3 ).

    IF sy-subrc <> 0.
** Raise error and exception handling if response is not received
    ENDIF.

    DATA: headers TYPE tihttpnvp.

    http_client->response->get_status( IMPORTING code = DATA(code) )." Get workitem data

** Fetch Response Headers
    CALL METHOD http_client->response->get_header_fields( CHANGING fields = headers ).
    DATA(resp) = http_client->response->get_cdata( ).
  ENDMETHOD.
ENDCLASS.
