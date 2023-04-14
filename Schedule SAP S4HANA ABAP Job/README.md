## Configure the SAP S/4HANA On-Premises and Sechdule the SAP S/4HANA ABAP Job

In this section we will focus on finish the configuration setup in the SAP S/4HANA On-Premises system, and sechdule the SAP S/4HANA ABAP backgroud job. This ABAP background job will read all the generated purchase order release workflow instances data from SAP S/4HANA table, and then send to message queue in the SAP BTP Event Mesh.

### 1. Obtain the SAP Event Mesh OAuth Client Credentials & Message Queue REST Endpoint
In this step, we will focus on obtain the SAP Event Mesh Oauth client credentials & SAP Event Mesh message queue rest endpoint from the SAP Event Mesh service key. We will use this credentials to setup the Oauth client and Oauth Profile in the SAP S/4HANA On-Premise system, to let SAP S/4HANA ABAP job send message to the SAP Event Mesh message queue through the REST API call.

1. Go back to the SAP BTP Cockpit. In the subaccount level click **Instance and Subscriptions** on the left panel. On the right side find the **SAP Event Mesh default plan instance** created by the automation tool, click on the record. Then click on View icon on the service ket section to view the details infomration of the service key.

    ![1](../assets/Configure%20S4HANA%20OnPrem/1.png)

2. Scroll down to the **httprest protocal** section, note down the **clientid**, **clientsecret**, **tokenendpoint**, and **uri** value since we will need those values later on.

    ![2](../assets/Configure%20S4HANA%20OnPrem/2.png)

### 2. Configure an RFC Destination in SAP S/4HANA On-Premises System

In this section we will configure an RFC Destination and point to the SAP BTP Event Mesh in the SAP S/4HANA On-Premises system, so that the ABAP job could utlize this destination to send data to the message queue in the SAP Event Mesh.

1. Go back to the SAP S/4HANA On-Premises system in SAP GUI, enter the transaction code **SM59** to open the **Configuration of RFC Connections** app. Click **Create** icon (highlighted in the screenshot below) to create a new RFC destination.
    
    ![3](../assets/Configure%20S4HANA%20OnPrem/3.png)

2. Give the proper name of the destination, select **G HTTP Connection to external server** from the Connection Type dropdown. Click the **green right mark** to go to the next page. **Note done the destination name as we will need it later on**.

    > - Please **DO NOT** give the destination name longer than 15 characters
    
    ![4](../assets/Configure%20S4HANA%20OnPrem/4.png)

3. Go to the **Technical Settings** tab. In the **Technical Settings** section, give the value of **Host** as the value of **uri** we obtained [section 1](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README.md#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2 (**without the https://**). Enter **443** as the value of port. 

    ![5](../assets/Configure%20S4HANA%20OnPrem/5.png)
    
4. Switch to the **Logon & Security** tab and scroll down to the **Security Options** section. Check **Active** for **SSL** and select **ANONYM SSL Client (Anonymous)** from the **SSL Certificate** drop down menu. Then click the **Save** button on the bottom. 

    ![6](../assets/Configure%20S4HANA%20OnPrem/6.png)

5. Click the **Connection Test** button to double-check whether the connection from SAP S/4HANA On-premises to SAP Event Mesh is established successfully.

    ![7](../assets/Configure%20S4HANA%20OnPrem/7.png)
    ![8](../assets/Configure%20S4HANA%20OnPrem/8.png)

### 3. Configure the OAuth Client & OAuth Profile in the SAP S/4HANA On-Premises System

In this section we will configure the OAuth Client and OAuth Profile in the SAP S/4HANA. The OAuth Client and Oauth Profile will be used along with the RFC Destination we just created in the SAP S/4HANA ABAP backgroud job to enable the communication.

1. Go back to the main page of SAP S/4HANA On-Premises in SAP GUI. Enter the transaction code **OA2C_CONFIG** to open the **OAuth 2.0 Clients web application**. Click the create button to create a new OAuth 2.0 client.
    
    > - Note
    > - If OAuth 2.0 Clients Web application was not open correctly, please use SAP S/4HANA On-Premise external IP address and port as the domain name in the pop up browser
    > - URL Format
    > - https://s4hana-external-ip:port/sap/bc/webdynpro/sap/oa2c_config?sap-language=EN&sap-client=100
    
    ![9](../assets/Configure%20S4HANA%20OnPrem/9.png)

2. Follow the instruction below to fill-out the form of **Create a new OAuth 2.0 Client**. **Note done the configuration name as we will need it later on**.
    
    - OAuth 2.0 Client Profile: /IWXBE/MGW_MQTT
    - Configuration Name:       Meaningful name
    - Oauth 2.0 Client ID:      **clientid** we obtained from [section 1](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README.md#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2. 
    
    ![10](../assets/Configure%20S4HANA%20OnPrem/10.png)

3. Scroll down to the **Details** tab. Follow the instruction below to complet the setup.

    - **Client Secret**: **clientsecret** we obtained from [section 1](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README.md#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2.
    - **Authorization Endpoint**: **tokenendpoint** we obtained from [section 1](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README.md#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2. **Replace /token to /authorize** 
    - **Token Endpoint**: **tokenendpoint** we obtained from [section 1](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README.md#1-obtain-the-sap-event-mesh-oauth-client-credentials--message-queue-rest-endpoint) step 2.
    - Scroll down to the **Access Settings** section and check the **Form Fields**, **Header Field** and **Client Credentials** option.
    
    ![11](../assets/Configure%20S4HANA%20OnPrem/11.png)
    
4. Scroll up and then click the **Save** button.
    
    ![12](../assets/Configure%20S4HANA%20OnPrem/12.png)

### 4. Import the ABAP Backgroud Job

In this section, we will focus on import & schedule the SAP S/4HANA ABAP backgroud job. This ABAP background job will read all the generated purchase order release workflow instances data from SAP S/4HANA table, and then send to message queue in the SAP BTP Event Mesh.

1. Go back to the main page of SAP S/4HANA On-Premises system in the SAP GUI. Enter the Transaction code **SE38** to open the **ABAP Editor** app, and then **execute** the **ZABAPGIT_STANDALONE** program.

    ![13](../assets/Configure%20S4HANA%20OnPrem/13.png)
    ![14](../assets/Configure%20S4HANA%20OnPrem/14.png)

2. In the ABAP Git screen, click the **New Online** button to import the pre-defined ABAP backgroud job source code from SAP public github repo.
    - **Note**
    - If you are seeing the SSL certification issues while importin the ABAP job source code, please follow the instruction below to import the SAP public GitHub certification into your SAP S/4HANA On-Premises system.
    - [Import the SAP public GitHub certification into the SAP S/4HANA On-Premises system](https://docs.abapgit.org/guide-ssl-setup.html)
    
    ![15](../assets/Configure%20S4HANA%20OnPrem/15.png)

3. In the **New Online Repository** page, please follow the instruction below to fill-out the form. Then click **Create Online Repo** button once done.
    
    > - **Git Repository URL**: 
    > - **Package**: Please follow [this instruction](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README2.md) to create a new package.
    > - **Branch**: s4h-abap
    > - **Display Name**: any ready friendly name
    
    ![16](../assets/Configure%20S4HANA%20OnPrem/16.png)
    
4. Click the **Clone Online Repo** button, and then click **pull** button to import the ABAP job source code into your SAP S/4HANA On-Premises system.
    
    ![17](../assets/Configure%20S4HANA%20OnPrem/17.png)

### 5. Modify the ABAP Job Source Code

After you clone the ABAP backgroud job source code from the GitHub repo, we have to make several changes to let the ABAP backgroud job use the RFC Destination, OAuth Client, and OAuth profile we created in the previous section.

1. Go back to the **ABAP Editor: Initial Screen** page. Enter **ZRP_SEND_PO_WF_DATA_TO_EM** in the Program search bar, select **Source Code** and click the **Display** button.
    
    ![18](../assets/Configure%20S4HANA%20OnPrem/18.png)

2. Double Click on the **ZRP_SEND_PO_WF_DATA_TO_EM( )** at **line 12** and then double click the **CONSTRUCTOR** method show up in the next page.
    
    ![19](../assets/Configure%20S4HANA%20OnPrem/19.png)
    ![20](../assets/Configure%20S4HANA%20OnPrem/20.png)

3. Click **Displat <-> Change** button on the the menu bar, and then follow the instructions below to update the constructor method. After that click **Save** button to save the changes.
    
    ![21](../assets/Configure%20S4HANA%20OnPrem/21.png)
    
    - **dest_name**: Change to the name of RFC destination we created in the step [2.2](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README.md#2-configure-an-rfc-destination-in-sap-s4hana-on-premises-system)
    - **auth_profile**: Change to the name of OAuth profile we created in the step [3.2](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README.md#3-configure-the-oauth-client--oauth-profile-in-the-sap-s4hana-on-premises-system)
    - **auth_conf**: Change to the name of OAuth Configuration we created in the step [3.2](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job/README.md#3-configure-the-oauth-client--oauth-profile-in-the-sap-s4hana-on-premises-system)
    
    ![22](../assets/Configure%20S4HANA%20OnPrem/22.png)

4. Click **Activate** button to make the constructor method changes active.
    
    ![23](../assets/Configure%20S4HANA%20OnPrem/23.png)
    
5. Back to the ZRP_SEND_PO_WF_DATA_TO_EM source code page, **double-click** on the **run_em_job** method at **line 12**, and then **double-click** on the **generate_em_rest_client** method on the **line 3**.
    
    ![24](../assets/Configure%20S4HANA%20OnPrem/24.png)
    ![25](../assets/Configure%20S4HANA%20OnPrem/25.png)

6. Scroll down to the line 51, **replace message queue name sap%2Fem%2Fs4%2Fpurchase-order** to the value of **additionalAutomationConfiguration.queueCreation.queue_name** you give in this [step section 3.7](https://github.tools.sap/btp-use-case-factory/s4-hana-purchase-order-approval-in-ms-teams/blob/mission/Resource%20Creation%20%26%20Application%20Deployment/README.md#3-update-the-bridge-framework-automation-pipeline-configuration-files).
    
    > - Note
    > - The value of message queue name you give in here should be the **encoded full-qulified** name. For example is the queue name is **sap/em/s4/purchase-order**, then the value you should give here is **sap%2Fem%2Fs4%2Fpurchase-order**.
    
    ![26](../assets/Configure%20S4HANA%20OnPrem/26.png)

7. Click **Save** to save the changes and then click **Activate** button to active the changes.

### 6. Schedule the ABAB Backgroud Job

Now we will schedule the ZRP_SEND_PO_WF_DATA_TO_EM ABAP report running in the backgroud opn every minute in the SAP S/4HANA system. This report will be serving as a backgroud job, read the purchase order approval workflow instance data and purchase order data from the SAP S/4HANA database, and send data to the message queue in the SAP Event Mesh service.

1. Go back to you SAP S/4HANA system in the SAP GUI. Enter the transaction code **SM36** to open the **Schedule Backgroud Job** app. Click **Job wizard** button to setup a schedule of a new backgroud job.
    
    ![27](../assets/Configure%20S4HANA%20OnPrem/27.png)

2. In the **Create a job** pop-up window, click **Continue** button.
    
    ![28](../assets/Configure%20S4HANA%20OnPrem/28.png)

3. In the **General job information** page, enter **ZRP_SEND_PO_WF_DATA_TO_EM** as the **Job Name** or any read-friendly name you would like to use. Click **Continue**.
    
    ![29](../assets/Configure%20S4HANA%20OnPrem/29.png)
    
4. In the **Job definition: Job step** page, choose **ABAP program** step.
    
    ![30](../assets/Configure%20S4HANA%20OnPrem/30.png)

5. Enter **ZRP_SEND_PO_WF_DATA_TO_EM** as the **ABAP Program Name**, and then click **Continue**.
    
    ![31](../assets/Configure%20S4HANA%20OnPrem/31.png)

6. Click **Continue** directly in the next two pages.
    
    ![32](../assets/Configure%20S4HANA%20OnPrem/32.png)
    ![33](../assets/Configure%20S4HANA%20OnPrem/33.png)

7. In the **Job definition: Start Conditions** page, choose **Immediately** and then click **Continue**.
    
    ![34](../assets/Configure%20S4HANA%20OnPrem/34.png)
    
8. In the **Def. of Start immediately** page, check **Period** checkbox, and then click Continue.
    
    ![35](../assets/Configure%20S4HANA%20OnPrem/35.png)

9. In the **Period definition** page, check **None of the above** radio button and then click the **Other periods** button.
    
    ![36](../assets/Configure%20S4HANA%20OnPrem/36.png)
    
10. Enter **1 minute** in the **Other Period Definition** pop-up window, and then click **Create** button.
    
    ![37](../assets/Configure%20S4HANA%20OnPrem/37.png)
    
11. In the **Set job** page, click **Complete** button to finish the ABAP backgroud job setup.
    
    ![38](../assets/Configure%20S4HANA%20OnPrem/38.png)




