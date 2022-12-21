*&---------------------------------------------------------------------*
*& Report ZRP_SEND_PO_WF_DATA_TO_EM
*&---------------------------------------------------------------------*
*&
*&---------------------------------------------------------------------*
REPORT ZRP_SEND_PO_WF_DATA_TO_EM.

DATA: timestamp TYPE tzntstmpl.
GET TIME STAMP FIELD timestamp .
timestamp = cl_abap_tstmp=>add( tstmp = timestamp secs = -60 ).

NEW ZRP_SEND_PO_WF_DATA_TO_EM( )->run_em_job( timestamp = timestamp ).
