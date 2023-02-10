# SAP BTP and Microsoft Azure Resources Creation  Bridge Framework Deployment

In this section, we will focus on using the Bridge Framework automation pipeline to finish the resource creation on the SAP BTP & Microsoft Azure, and extension application deployment.

## 1. Prerequisites
1. Please make sure the have the docker and docker engine installed on your local machine. If you do not have the docker installed already on your local machine, please follow the instructions below to install the docker on your local machine.
    
    - [Install Docker on Windows OS](https://docs.docker.com/desktop/install/windows-install/)
    - [Install Docker on Mac OS](https://docs.docker.com/desktop/install/mac-install/)

2. Assign **service entities** to your SAP BTP subaccount. Click the **Entitlements -> Entity Assignments** under the SAP BTP Glocbal account cockpit, check the subaccount you would like to use as a host, click the Select button.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208505567-e0017836-7fda-468a-8aab-fb58488fe955.png)

3. Click the **Configure Entitlements** button, then click the **Add Service Plan** button.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208506686-af80ebad-3f61-4c4a-8d66-039c7cacfad0.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208506850-f77f2675-c4c3-4254-8237-449a588351d8.png)

4. Add below service plans into your subaccount.
    
    - **Cloud Foundry Runtime MEMORY** plan
    - **Event Mesh default** plan
    - **Event Mesh standard (Application)** plan

    ![tempsnip](https://user-images.githubusercontent.com/29527722/208507850-1f6d861b-e584-4d22-91f3-41c2fade6cff.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208508084-19ed9ba9-1e1d-489f-b01e-79f817ae31f9.png)

5. Click the **Save** button to save the changes.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208508366-059cb885-ee72-4d0e-b57e-f88e8c8b0b72.png)

6. Go into the SAP BTP subaccount, enable the Cloud Foundry by clicking the **Enable Cloud Foundry** button. Create the new space by clikcing the **Create Space** button.
    
    - **Note down the space name, we will use it later**.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208509277-d51cd14d-e04f-4eea-90bf-27fc4c8669af.png)

## 2. Download the Automation Tool Docker Image

1. Download the automation tool docker image **bridge-automation-pipeline.tar.gz**. Please **double check your local machine operation system**, and download the proper docker image by using the link below
    
    - For **MacOS** users
      - MacOs with **Intel Chip** 
        - [Bridge Framework Automation Pipeline Docker Image](https://github.wdf.sap.corp/SCE/sap-mission-s4-hana-purchase-order-approval/releases/tag/v1.0.0-alpha)
      - MacOs with **M1 Chip**
        - [Bridge Framework Automation Pipeline Docker Image](https://github.wdf.sap.corp/SCE/sap-mission-s4-hana-purchase-order-approval/releases/tag/v1.0.0-beta)
    - For **WindowsOS** users
      - [Bridge Framework Automation Pipeline Docker Image](https://github.wdf.sap.corp/SCE/sap-mission-s4-hana-purchase-order-approval/releases/tag/v1.0.0-alpha)
    
2. Open the CMD tool in your local machine, go into the directory where the downloaded Bridge Framework automation pipeline docker image stored.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208526292-4389f31b-0c2d-4b9b-afff-65c3fd40e737.png)

3. Issue the command command below to load the Bridge Framework automation pipeline docker image in your local machine.
    
    - **docker load -i ./bridge-automation-pipeline.tar.gz**
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208526799-f44d4757-84a1-4e98-a833-06c81067d565.png)

4. Issue the command below to run the Bridge Framework automation pipeline docker image as container. After the execution, you will see an container ID returned in the terminal.
    
    - **docker container run -e BTPSA_VERSION_GIT="\$(git describe --long --tags  --always)" --rm  -it -d --name bridge-automation-pipeline bridge-automation-pipeline** 

    ![Capture](https://user-images.githubusercontent.com/29527722/208529877-d69c415d-5477-4e54-9807-8b1fe891ee35.PNG)
    
## 3. Update the Bridge Framework Automation Pipeline Configuration Files 

1. Open the **Visual Studio Code** (VSC) IDE, click **Ctrl+Shift+P** to open the **Command Palette**. Choose the **Dev Container: Attach to Running Container...** in the dropdown menu. 
    
    > **Note**
    > - Please **install** the **VSC extensions** listing below before open the Command Palette
    > - **Dev Containers**
    > - **Remote Development**
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208532399-6645cd4e-24c0-416e-87cc-f2cb89bd70b4.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208533691-8f1463a5-65ca-4ca8-acfc-cf9a4ae4391a.png)

2. Select the running container **bridge-automation-pipeline** in the drop down menu.
    
    ![Capture](https://user-images.githubusercontent.com/29527722/208536304-2b7c50c3-aee5-4217-819f-5358e10bb0e0.PNG)
    
3. We should inside of the bridge framework automation tool container which is up-and-running in our local machine. Lets update the configuration file of the container so that it could help us create the resource on SAP BTP and Microsof Azure, and deploy the extension application in SAP BTP.

4. Expend the **btp-bridge-framework -> config -> public** folder, **delete the existing backedn, frontend and notification folder**. **Drag and drop** the following folders we got from this [step](https://flpnwc-ad17b8dc3.dispatcher.hana.ondemand.com/sites/admincenter#projectboard-Display&/masterboard/4164/card/9356957) under the **btp-bridge-framework -> config -> public** directory in the container.
    
    -  **backend**
    -  **frontend**
    -  **notification**
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208549375-3a3fcb46-7df9-48b8-aefb-455bad300835.png)
    
5. **Open** the **notificationConfig.json** file under the directory **btp-bridge-framework -> config -> public -> notification**. At line No.12 update the **s4hana-onprem-internal-host-ip**:**port** to your **SAP S/4HANA On-Premise system internal server ip** and **port number**. Save the changes.

    ![tempsnip](https://github.wdf.sap.corp/storage/user/105079/files/a5eaacb5-b3f4-460e-901e-e413cc68be8d)
    
6. Open the **default.json** file under the directory **usecases -> released -> default.json**. This files contains the information which the Bridge Framework automation pipeline will used to configure the SAP BTP Service instances needed by the Bridge Framework. We needs to **update some configurations** for the **SAP BTP Destination service instance**, and the **SAP Event Mesh service instance**.
    
    - For the **SAP BTP Destination service instance configuration**, **updates** the **http://s4hanaonprem:44300** at **line No.53** to the **virtual host name** and **virtual host port** you defined in the SAP S/4HANA Cloud Connector. You could find your SAP S/4HANA Cloud Connector virtual host and virtual port information on the SAP BTP subacounnt. 
       
       ![tempsnip](https://github.wdf.sap.corp/storage/user/105079/files/a9e349aa-86a2-46a4-9ce6-56d8ee72d7b2)
       
    - For the **SAP BTP Event Mesh service instance configuration**:
      
      - Updates **emname** at **line No.85** to a meaningful, read friendly name you would like to use. The Bridge Framework automation pipeline will creates the Event Mesh message client with the name you give here.

      - Updates **namespace** at **line No.86** to a meaningful, read friendly name you would like to use. The Bridge Framework automation pipeline will creates the Event Mesh message client with the namespace you give here.
        
        > - Note:
        > - The **Format** of the **namespace** is **org_name/emname/uuid**, so please make sure to give the namespace in this format exactly, and give the **emname value you entered at line No.85 at the middle**. 
        > - **Failed to give the namespace value in correct will cause automation pipeline execution failed out**. 


7. **Open** the **parameters.json** file under the **root directory** in the container. This file is used to hold the data of your SAP BTP Subaccount and Microsoft Azure subscription. **The automation pipeline will use the value you give in this file to create resources on SAP BTP and Microsoft Azure, and deploy your extension application on SAP BTP**. 

    Please follow the instruction below to update the variable's value in this file**.
    
      - **SAP BTP Global Account and Subaccount Section**
        
        From line No.4 to line No.14 is the place to give your SAP BTP Global Account and Subaccount Account information. The Bridge Framework automation pipeline could get access to your SAP BTP subaccount, and then create the SAP BTP service instances needed by the Bridge Framework. These variable's value you could obtain from your SAP BTP subaccount Overview page.
      
        - **region**: the SAP BTP Subaccount region.
        - **globalaccount** : the SAP BTP global account name.
        - **subaccountid**: Subaccount ID shows on your SAP BTP subaccount Overview page.
        - **subaccountname**: Subdomain name shows on your SAP BTP subaccount Overview page
        - **subdomain**: Subdomain name shows on your SAP BTP subaccount Overview page
        - **orgid**: Org ID shows on your SAP BTP subaccount Overview page.
        - **org**: Org Name shows on your SAP BTP subaccount Overview page.
        - **cfcliapihostregion**: This value is part of API Endpoint. Somethinkg like US20/US10
        - **cfspacename**: The space name we just created.
        - **myemail**: The email address you used to create the configured the SAP BTP Subaccount.
    
        ![tempsnip](https://user-images.githubusercontent.com/29527722/208554531-d287d165-1706-40b0-98ad-b0a6387c0d39.png)
    
     - **Microsft Azure Subscription Section**
     
       From the line No.16 to line No.55 is the place for you to configure the resource needed by the Bridge Framework on your Microsoft Azure subscription.
       
         - **azureResources.tags**  (Line No.17 - No.20)
           
           This section is used to adding tags to the Microsoft Blob Storage service and Microsoft Bot Service that would be created by the automation pipeline. So that you could it to monitor the cost of these two services in the Microsoft Azure Cost Management console.
           
           - **azureResources.tags.sourceSystem**: any read friendly name of your sourcing SAP product. You could leave it as what it is for now.
           - **azureResources.tags.businessProcess**: any read friendly name of the business process you would like to integrated. You could leave it as what it is for now.
           
         - **azureResources.resourceGroup**  (Line No.21 - No.24)
         
           This section is used to configure the name of the Microsoft Azure resource group and it's location. The Bridge Framework automation pipeline will use it to create the resouce group with the name and location you given here.
           
           - **azureResources.resourceGroup.location**: **westus** or any location geographically near to you. 
           - **azureResources.resourceGroup.resourceGroupName**: any read friendly name. 
         
         - **azureResources.applicationRegistration** (Line No.25 - No.36)
         
           This section is used to configure the App Registration on Microsoft Azure. The Bridge Framework automation pipeline will use it to create the App Registration with the name you given here.
           
           - **azureResources.applicationRegistration.registrationName**: any read friendly name.
           - **azureResources.applicationRegistration.replyUrlsPrefixes**:
               
               1. Delete the domain name at line No.30.
               2. Change the us10 at line No.30 to the value of cfcliapihostregion you gave at line No.11 in this file.
           
           - **azureResources.applicationRegistration.identifierUrisPrefixes**:
               
               1. Change the us10 at line No.33 to the value of cfcliapihostregion you gave at line No.11. in this file
               
           - **azureResources.applicationRegistration.tokenExchangeUrlPrefix**:
           
               1. Change the us10 at line No.35 to the value of cfcliapihostregion you gave at line No.11 in this file.
               
         - **azureResources.botService** (Line No.37 - No.45)
         
           This section is used to configure the Bot Service on Microsoft Azure. The Bridge Framework automation pipeline will use it to create the Azure Bot Service with the name you given here.
           
             - **azureResources.botService.botName**: any meaningful, ready freiendly name you would like to use. The Bridge Framework automation pipeline will create the bot service with the name you give here.
             - **azureResources.botService.messagingEndpoint**:
               
               1. Change the us10 at line No.39 to the value of cfcliapihostregion you gave at line No.11 in this file.
               
             - **azureResources.botService.providerScopeBaseUrl**:
             
               1. Change the us10 at line No.40 to the value of cfcliapihostregion you gave at line No.11 in this file.
               
             - **azureResources.botService.connectionNamePrefix**: any meaningful, ready freiendly name you would like to use.

        - **azureResources.blobStorage** (Line No.46 - No.51)
        
          This section is used to configure the Blob Storage Service on Microsoft Azure. The Bridge Framework automation pipeline will use it to create the Blob Storage Account and Blob Storage Container with the name you given here.
          
          - **azureResources.blobStorage.blobStorageContainerName**: any meaningful, ready freiendly name you would like to use. The Bridge Framework will create the Azure Blob Storage container with the name you give here.
          - **azureResources.blobStorage.blobStorageAccountName**: any meaningful, ready freiendly name you would like to use. The Bridge Framework will create the Azure Blob Storage account with the name you give here. 
          
        - **azureResources.enterpriseApp** (Line No.52 - No.54)
        
          This section is used to grant Microsoft Teams extension application's user access to the Enterprise Application we manually configured in this [prevsiou step](https://github.wdf.sap.corp/SCE/sap-mission-s4-hana-purchase-order-approval/blob/mission/Principle-Propagation-Microsoft-Azure-SAP-BTP/README.md).
          
          - **azureResources.enterpriseApp.emails**:
            
            1. Add purchase order creator, purchase order approver's email address into this email array.

     - **Additional Automation Configuration Section**
     
       From the line No.56 to line No.77 is the place for you to configure the additional resources needed by the Bridge Framework on your SAP BTP subaccount.
       
       - **additionalAutomationConfiguration.queueCreation** (Line No.62 - No.66)
         
         This section is used to configure the Message Queue and the Webhook Subscription of the SAP Event Mesh Services. The Message Queueu will receive the purchase order & workflow instance data sending from SAP S/4HANA On-Premise system, and the Webhook subscription will be forwarding the message from message queue to the bridge framework backend service whish is hosted in your SAP BTP Subaccount.
         
         - **additionalAutomationConfiguration.queueCreation.subscription_name**: any meaningful, read freiendly name. The Bridge Framework automation pipeline will create the Webhook subscription on the message queue with the name you give here.
         - **additionalAutomationConfiguration.queueCreation.endpoint**:
           
           1. Change the us10 at line No.64 to the value of cfcliapihostregion you gave at line No.11 in this file.
           
         - **additionalAutomationConfiguration.queueCreation.queue_name**:
           
           1. any meaningful, read freiendly name. The Bridge Framework will create the message queue in the SAP Event Mesh service with the name you give here. 
           
              > - **Note**
              > - The **format** of the **queue name** should be **namespace/queueName**. 
              > - **Please use the value of namespace as the one you give in default.json file line No.86**
              > - For example,
              > - If you define the **namespace** as **TISCE/bridgeframeworkEmClient/s4h**, and **queue name** as **purchase-order-approval**
              > - Then you should give value as **TISCE/bridgeframeworkEmClient/s4h/purchase-order-approval**
    
       - **additionalAutomationConfiguration.destinationCreation** (Line No.67 - No.71)
       
         - **additionalAutomationConfiguration.destinationCreation.destination_name**: copy and paste the value of defalut.json file at line No.51.
         - **additionalAutomationConfiguration.destinationCreation.virtual_host**: the virtual host name entered in the S/4HANA On-Premise Cloud Connector.
         - **additionalAutomationConfiguration.destinationCreation.virtual_host**: the virtual port entered in the S/4HANA On-Premise Cloud Connector.
    
       - **additionalAutomationConfiguration.envCreation** (Line No.72 - No.76)
       
         This section is used to create some necessary enviroument variables needed by the Bridge Framework backend service that will be deployed in your SAP BTP subaccount.
         
           - **additionalAutomationConfiguration.envCreation.saml_alias**:
             
             1. If you subaccount is hosted on AWS: (subaccountname).aws-live
             2. If you subaccont is hosted on Azure: (subaccountname).azure-(cfcliapihostregion)

## 4. Trigger the Automation Tool Docker Container

As we already provided the SAP BTP subaccount and Microsoft Azure metadata within the automation tool configuration file, now it's time for us to run the automation tool container and let it create the resources on SAP BTP and Microsoft Azure for us, and deploy the extension application for us.

1. Open a new terminal in the VSC, and execute the command "./btpsa" under the root directory in the container.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208748406-32eb7599-770e-49e2-aa0a-d902fdefcfc8.png)

2. There will be a link shows up in the terminal and asks you to do the manual login. Copy this link and open it in a browser, and click Procedd and log in button in the pop-up page in the browser.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208748732-760a94a4-d4cf-4a1a-b2d5-8eb5fff5bb9f.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208748964-90546496-274b-485d-ac36-75f22e40a052.png)

3. After a while you will see there is a manual login request shows up in the terminal. This step is for Microsoft Azure Powershall authentication. Copy the authentication code and then open the URL in the browser to finish the manual Azure login.
    
    ![xx](https://user-images.githubusercontent.com/29527722/208751511-90c4b136-72fa-4216-9dfe-30c7c8471ecd.png)
    ![Capture2](https://user-images.githubusercontent.com/29527722/208751607-f6b7184a-fc47-41f9-add5-acece1c5f37e.PNG)
    ![Capture3](https://user-images.githubusercontent.com/29527722/208751742-523f1b7e-289d-4562-9abb-1296508e0a31.PNG)

4. Then you will see another manual login request shows up in the terminal. This step is for Microsoft Azure CLI authentication. Copy the newly generated authentication code and URL into the browser, and finish the second time manual Azure login.
    
    ![Capture4](https://user-images.githubusercontent.com/29527722/208752435-2bb2c0b7-5093-4584-b478-1967ad1c92e7.PNG)
    ![Capture5](https://user-images.githubusercontent.com/29527722/208752453-581b0c39-ec04-4b04-a55a-a1e104a18618.PNG)
    ![Capture3](https://user-images.githubusercontent.com/29527722/208751742-523f1b7e-289d-4562-9abb-1296508e0a31.PNG)

5. Once the Microsoft Azure resource creation is done, the SAP BTP service instances creation and extension application deployment on SAP BTP side will begin. You will be asked to do provide the **SAP BTP subaccount credential** in the terminal. Please enter the your **BTP subaccount CF API endpoint**, **Email**, and **Password** in the ternimal, and then select the **subaccount** and **target space** which will be used as a host of your extension application.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208992547-97725af7-b77e-470a-9037-129c828f5ec2.png)
    
6. Since the CF CLI will not hold your login credentials for a long time, so you will be asked again to provide your SAP BTP credentials like what we did in step 5. Please keep an eye on the terminal and process it timely. 
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208993594-a8ea5402-cdf7-40d3-804e-ec6b98b2c653.png)

7. Finally in your terminal you will see **SUCCESSFULLY FINISHED USE CASE EXECUTION**. This mean that all the resources creation and extension application deployment has been done successfully.  

    ![tempsnip](https://user-images.githubusercontent.com/29527722/208994218-2fa7ab65-cd45-41ed-9614-9f7edbcbc0a6.png)
 
## 5. Potential Error Fixing (Optional)

Sometimes the API Permission grantaion on the Microsoft Azure app registration created by the Bridge Framework automation pipeline will failed out, and it will cause the issue that this app registration doesn't have the permission to query user information from SAP Graph service. Let's double check and manual fixing this issue if it presents.

1. Go back to the Microsoft Azure Portal, find the app registration with the name you give in parameters.json file line No.25. 
   
   ![tempsnip](https://github.wdf.sap.corp/storage/user/105079/files/3ccc58e3-b268-4cf3-91c7-85709c96601f)
   
   ![tempsnip](https://github.wdf.sap.corp/storage/user/105079/files/3c8a2fe2-619f-467f-9f03-cfd438c2a678)

2. Click the **API permissions** button on the left panel. Double check whether all the Microsoft Graph API permissions has the **green checkmark** under the **Status** column.
   
   ![tempsnip](https://github.wdf.sap.corp/storage/user/105079/files/c78b37c3-e4b7-4407-86da-a3864831f6ae)

3. If not, then please click the **Grant admin consent for ticoo** button to manually grant Microsoft Graph API permissions to the app registration.
   
   ![tempsnip](https://github.wdf.sap.corp/storage/user/105079/files/b90969bc-0e95-4032-a6b9-c4eb0d21e28c)
