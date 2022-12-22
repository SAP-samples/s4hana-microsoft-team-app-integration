## Configure the SAP S/4HANA On-Premises and Sechdule the SAP S/4HANA ABAP Job

In this section we will focus on finish the configuration setup in the SAP S/4HANA On-Premises system, and sechdule the SAP S/4HANA ABAP backgroud job. This ABAP background job will read all the generated purchase order release workflow instances data from SAP S/4HANA table, and then send to message queue in the SAP BTP Event Mesh.

### 1. Obtain the SAP Event Mesh OAuth Client Credentials & Message Queue REST Endpoint
In this step, we will focus on obtain the SAP Event Mesh Oauth client credentials & SAP Event Mesh message queue rest endpoint from the SAP Event Mesh service key. We will use this credentials to setup the Oauth client and Oauth Profile in the SAP S/4HANA On-Premise system, to let SAP S/4HANA ABAP job send message to the SAP Event Mesh message queue through the REST API call.

1. Go back to the SAP BTP Cockpit. In the subaccount level click **Instance and Subscriptions** on the left panel. On the right side find the SAP Event Mesh default plan instance created by the automation tool, click on the record. Then click on View icon on the service ket section to view the details infomration of the service key.

    ![tempsnip](https://user-images.githubusercontent.com/29527722/207452670-3184e139-3afd-418e-82fe-ee9e12669463.png)

2. Scroll down to the **httprest protocal** section, note down the **clientid**, **clientsecret**, **tokenendpoint**, and **uri** value since we will need those values later on.

    ![tempsnip](https://user-images.githubusercontent.com/29527722/207471110-2fa6b228-f119-4428-a622-86a6fa577696.png)

### 2. Configure an RFC Destination in SAP S/4HANA On-Premises System

In this section we will configure an RFC Destination and point to the SAP BTP Event Mesh in the SAP S/4HANA On-Premises system, so that the ABAP job could utlize this destination to send data to the message queue in the SAP Event Mesh.

1. Go back to the SAP S/4HANA On-Premises system in SAP GUI, enter the transaction code **SM59** to open the **Configuration of RFC Connections** app. Click **Create** icon (highlighted in the screenshot below) to create a new RFC destination.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207472801-8a6612aa-0071-4c0b-910f-d729b2bf8adb.png)

2. Give the proper name of the destination, select **G HTTP Connection to external server** from the Connection Type dropdown. Click the **green right mark** to go to the next page. **Note done the destination name as we will need it later on**.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207473304-232dd4a2-ebcd-41df-8d2d-16d6c9225050.png)

3. Go to the **Technical Settings** tab. In the **Technical Settings** section, give the value of **Host** as the value of **uri** we obtained [section 1](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2 (**without the https://**). Enter **443** as the value of port. 

    ![tempsnip](https://user-images.githubusercontent.com/29527722/207474742-5c3868f5-49fd-4ed4-af29-ab710a3cb959.png)
    
4. Switch to the **Logon & Security** tab and scroll down to the **Security Options** section. Check **Active** for **SSL** and select **ANONYM SSL Client (Anonymous)** from the **SSL Certificate** drop down menu. Then click the **Save** button on the bottom. 

    ![tempsnip](https://user-images.githubusercontent.com/29527722/207475383-14d43d34-e92c-4276-a415-2daaf7a508df.png)

5. Click the **Connection Test** button to double-check whether the connection from SAP S/4HANA On-premises to SAP Event Mesh is established successfully.

    ![tempsnip](https://user-images.githubusercontent.com/29527722/207476256-24cec9c7-dde3-434a-b56b-ee65092b7cc2.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207476385-ff41b4c4-97ce-4447-a721-b4379c93509f.png)

### 3. Configure the OAuth Client & OAuth Profile in the SAP S/4HANA On-Premises System

In this section we will configure the OAuth Client and OAuth Profile in the SAP S/4HANA. The OAuth Client and Oauth Profile will be used along with the RFC Destination we just created in the SAP S/4HANA ABAP backgroud job to enable the communication.

1. Go back to the main page of SAP S/4HANA On-Premises in SAP GUI. Enter the transaction code OA2C_CONFIG to open the OAuth 2.0 Clients web application. Click the create button to create a new OAuth 2.0 client.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207477632-1aba580c-56bc-407a-8e30-b79087fa36f6.png)

2. Follow the instruction below to fill-out the form of **Create a new OAuth 2.0 Client**. **Note done the configuration name as we will need it later on**.
    
    - OAuth 2.0 Client Profile: /IWXBE/MGW_MQTT
    - Configuration Name:       Meaningful name
    - Oauth 2.0 Client ID:      **clientid** we obtained from [section 1](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2. 
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207478420-d12c5c12-5f9e-44ce-994e-5776be84e3b7.png)

3. Scroll down to the **Details** tab. Follow the instruction below to complet the setup.

    - **Client Secret**: **clientsecret** we obtained from [section 1](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2.
    - **Authorization Endpoint**: **tokenendpoint** we obtained from [section 1](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2. **Replace /token to /authorize** 
    - **Token Endpoint**: **tokenendpoint** we obtained from [section 1](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2.
    - Scroll down to the **Access Settings** section and check the **Form Fields**, **Header Field** and **Client Credentials** option.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207480086-c8f70e13-0606-4a9b-b74a-42543a231260.png)
    
4. Scroll up and then click the **Save** button.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207480284-f25bae50-7957-4bb6-90cf-7744d87f34c8.png)

### 4. Import the ABAP Backgroud Job

In this section, we will focus on import & schedule the SAP S/4HANA ABAP backgroud job. This ABAP background job will read all the generated purchase order release workflow instances data from SAP S/4HANA table, and then send to message queue in the SAP BTP Event Mesh.

1. Go back to the main page of SAP S/4HANA On-Premises system in the SAP GUI. Enter the Transaction code **SE38** to open the **ABAP Editor** app, and then **execute** the **ZABAPGIT_STANDALONE** program.

    ![tempsnip](https://user-images.githubusercontent.com/29527722/207676469-a4b82691-420e-4fd9-aefa-00eff954e851.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207677582-93bda801-97b8-4603-a665-cb09efa21c8e.png)

2. In the ABAP Git screen, click the **New Online** button to import the pre-defined ABAP backgroud job source code from SAP public github repo.
    - **Note**
    - If you are seeing the SSL certification issues while importin the ABAP job source code, please follow the instruction below to import the SAP public GitHub certification into your SAP S/4HANA On-Premises system.
    - [Import the SAP public GitHub certification into the SAP S/4HANA On-Premises system](https://docs.abapgit.org/guide-ssl-setup.html)
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207687279-24997767-8bb4-4e4b-9992-3e1a9169c8be.png)

3. In the **New Online Repository** page, please follow the instruction below to fill-out the form. Then click **Create Online Repo** button once done.
    
    > - **Git Repository URL**: 
    > - **Package**: any package in your SAP S/4HANA On-Premises system
    > - **Branch**: s4h-abap
    > - **Display Name**: any ready friendly name
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207690987-48d3292c-4cc7-4e2f-a4a4-d03fad2675ae.png)
    
4. Click the **Clone Online Repo** button, and then click **pull** button to import the ABAP job source code into your SAP S/4HANA On-Premises system.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209022505-9dc7f06c-5d30-458a-a753-6d4b6a678aae.png)

### 5. Modify the ABAP Job Source Code

After you clone the ABAP backgroud job source code from the GitHub repo, we have to make several changes to let the ABAP backgroud job use the RFC Destination, OAuth Client, and OAuth profile we created in the previous section.

1. Go back to the **ABAP Editor: Initial Screen** page. Enter **ZRP_SEND_PO_WF_DATA_TO_EM** in the Program search bar, select **Source Code** and click the **Display** button.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209023357-c9b67258-cd41-4dfe-9212-45edadde6a45.png)

2. Double Click on the **ZRP_SEND_PO_WF_DATA_TO_EM( )** at **line 12** and then double click the **CONSTRUCTOR** method show up in the next page.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209026583-83510b11-eb28-4a66-a79e-1a1bd87903cd.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209026677-a4733e11-bee9-44ac-824d-d8cebef1f20f.png)

3. Click **Displat <-> Change** button on the the menu bar, and then follow the instructions below to update the constructor method. After that click **Save** button to save the changes.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209027137-2214bf32-9c83-40b7-99fa-a85a31fd532c.png)
    
    - **dest_name**: Change to the name of RFC destination we created in the step [2.2](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job#2-configure-an-rfc-destination-in-sap-s4hana-on-premises-system)
    - **auth_profile**: Change to the name of OAuth profile we created in the step [3.2](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job#3-configure-the-oauth-client--oauth-profile-in-the-sap-s4hana-on-premises-system)
    - **auth_conf**: Change to the name of OAuth Configuration we created in the step [3.2](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job#3-configure-the-oauth-client--oauth-profile-in-the-sap-s4hana-on-premises-system)
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209027860-b9a11a46-9f5c-4121-b135-302304cad96e.png)

4. Click **Activate** button to make the constructor method changes active.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209028234-a9df062f-70af-46d1-8288-54938433f4a3.png)
    
5. Back to the ZRP_SEND_PO_WF_DATA_TO_EM source code page, **double-click** on the **run_em_job** method at **line 12**, and then **double-click** on the **generate_em_rest_client** method on the **line 3**.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209028746-55bf8293-0066-453a-9cbd-df4f1c88b73f.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209029249-0a971329-fc44-4c37-a4aa-6e86e19afdd7.png)

6. Scroll down to the line 51, **replace message queue name sap%2Fem%2Fs4%2Fpurchase-order** to the one we defined in this section.
    
    > - Note
    > - 
    
