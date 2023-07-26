# SAP BTP and Microsoft Azure Resources Creation  Bridge Framework Deployment

In this section, we will focus on using the Bridge Framework automation pipeline to finish the resource creation on the SAP BTP & Microsoft Azure, and extension application deployment.

## 1. Prerequisites
1. Please make sure the have the docker and docker engine installed on your local machine. If you do not have the docker installed already on your local machine, please follow the instructions below to install the docker on your local machine.
    
    - [Install Docker on Windows OS](https://docs.docker.com/desktop/install/windows-install/)
    - [Install Docker on Mac OS](https://docs.docker.com/desktop/install/mac-install/)

2. Assign **service entities** to your SAP BTP subaccount. Click the **Entitlements -> Entity Assignments** under the SAP BTP Glocbal account cockpit, check the subaccount you would like to use as a host, click the Select button.
    
    ![1](../assets/Resource%20Creation%20%26%20Application%20Deployment/1.png)

3. Click the **Configure Entitlements** button, then click the **Add Service Plan** button.
    
    ![2](../assets/Resource%20Creation%20%26%20Application%20Deployment/2.png)
    ![3](../assets/Resource%20Creation%20%26%20Application%20Deployment/3.png)

4. Add below service plans into your subaccount.
    
    - **Cloud Foundry Runtime MEMORY** plan
    - **Event Mesh default** plan
    - **Event Mesh standard (Application)** plan

    ![4](../assets/Resource%20Creation%20%26%20Application%20Deployment/4.png)
    ![5](../assets/Resource%20Creation%20%26%20Application%20Deployment/5.png)

5. Click the **Save** button to save the changes.
    
    ![6](../assets/Resource%20Creation%20%26%20Application%20Deployment/6.png)

6. Go into the SAP BTP subaccount, enable the Cloud Foundry by clicking the **Enable Cloud Foundry** button. Create the new space by clikcing the **Create Space** button.
    
    - **Note down the space name, we will use it later**.
    
    ![7](../assets/Resource%20Creation%20%26%20Application%20Deployment/7.png)

## 2. Download the Automation Tool Docker Image

1. Download the automation tool docker image **bridge-automation-pipeline.tar.gz**. Please **double check your SAP BTP Account Type**, and download the proper docker image by using the link below
    
    - For **SAP BTP Regular Account** users
      - [Bridge Framework Automation Pipeline Docker Image](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/releases/tag/v1.0.0-alpha)
    
2. Open the CMD tool in your local machine, go into the directory where the downloaded Bridge Framework automation pipeline docker image stored.
    
    ![8](../assets/Resource%20Creation%20%26%20Application%20Deployment/8.png)

3. Issue the command command below to load the Bridge Framework automation pipeline docker image in your local machine.
    
    - **docker load -i ./bridge-automation-pipeline.tar.gz**
    
    ![9](../assets/Resource%20Creation%20%26%20Application%20Deployment/9.png)

4. Issue the command below to run the Bridge Framework automation pipeline docker image as container. After the execution, you will see an container ID returned in the terminal.
    
    - **docker container run -e BTPSA_VERSION_GIT="\$(git describe --long --tags  --always)" --rm  -it -d --name bridge-automation-pipeline bridge-automation-pipeline** 

    ![10](../assets/Resource%20Creation%20%26%20Application%20Deployment/10.png)
    
## 3. Update the Bridge Framework Automation Pipeline Configuration Files

#### **Please update the Docker Desktop app in your local machine to the latest version before running the automation pipeline**

1. Open the **Visual Studio Code** (VSC) IDE, click **Ctrl+Shift+P** to open the **Command Palette**. Choose the **Dev Container: Attach to Running Container...** in the dropdown menu. 
    
    > **Note**
    > - Please **install** the **VSC extensions** listing below before open the Command Palette
    > - **Dev Containers**
    > - **Remote Development**
    
    ![11](../assets/Resource%20Creation%20%26%20Application%20Deployment/11.png)
    ![12](../assets/Resource%20Creation%20%26%20Application%20Deployment/12.png)

2. Select the running container **bridge-automation-pipeline** in the drop down menu.
    
    ![13](../assets/Resource%20Creation%20%26%20Application%20Deployment/13.png)
    
3. We should inside of the bridge framework automation tool container which is up-and-running in our local machine. Lets update the configuration file of the container so that it could help us create the resource on SAP BTP and Microsof Azure, and deploy the extension application in SAP BTP.

4. Expend the **btp-bridge-framework -> config -> public** folder, **delete the existing backedn, frontend and notification folder**. **Drag and drop** the following folders we got from this [step](https://flpnwc-ad17b8dc3.dispatcher.hana.ondemand.com/sites/admincenter#projectboard-Display&/masterboard/4164/card/9356957) under the **btp-bridge-framework -> config -> public** directory in the container.
    
    -  **backend**
    -  **frontend**
    -  **notification**
    
    ![14](../assets/Resource%20Creation%20%26%20Application%20Deployment/14.png)
    
5. **Open** the **notificationConfig.json** file under the directory **btp-bridge-framework -> config -> public -> notification**. At line No.12 update the **s4hana-onprem-internal-host-ip**:**port** to your **SAP S/4HANA On-Premise System external server ip** and **port number**. Save the changes.

    ![15](../assets/Resource%20Creation%20%26%20Application%20Deployment/15.png)
    
6. Open the **default.json** file under the directory **usecases -> released -> default.json**. This files contains the information which the Bridge Framework automation pipeline will used to configure the SAP BTP Service instances needed by the Bridge Framework. We needs to **update some configurations** for the **SAP BTP Destination service instance**, and the **SAP Event Mesh service instance**.
    
    - For the **SAP BTP Destination service instance configuration**, **updates** the **http://s4hanaonprem:44300** at **line No.53** to the **virtual host name** and **virtual host port** you defined in the SAP S/4HANA Cloud Connector. You could find your SAP S/4HANA Cloud Connector virtual host and virtual port information on the SAP BTP subacounnt. 
       
       ![16](../assets/Resource%20Creation%20%26%20Application%20Deployment/16.png)
       
    - For the **SAP BTP Event Mesh service instance configuration**:
      
      - Updates **emname** at **line No.85** to a meaningful, read friendly name you would like to use. The Bridge Framework automation pipeline will creates the Event Mesh message client with the name you give here.

      - Updates **namespace** at **line No.86** to a meaningful, read friendly name you would like to use. The Bridge Framework automation pipeline will creates the Event Mesh message client with the namespace you give here.
        
        > - Note:
        > - The **Format** of the **namespace** is **org_name/emname/uuid**, so please make sure to give the namespace in this format exactly, and give the **emname value you entered at line No.85 at the middle**. 
        > - **Failed to give the namespace value in correct will cause automation pipeline execution failed out**. 


7. **Open** the **parameters.json** file under the **root directory** in the container. This file is used to hold the data of your SAP BTP Subaccount and Microsoft Azure subscription. **The automation pipeline will use the value you give in this file to create resources on SAP BTP and Microsoft Azure, and deploy your extension application on SAP BTP**. 

    Please follow the instruction below to update the variable's value in this file**.
    
      - **SAP BTP Global Account and Subaccount Section**
        
        From line No.4 to line No.13 is the place to give your SAP BTP Global Account and Subaccount Account information. The Bridge Framework automation pipeline could get access to your SAP BTP subaccount, and then create the SAP BTP service instances needed by the Bridge Framework. These variable's value you could obtain from your SAP BTP subaccount Overview page.
      
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
    
        ![17](../assets/Resource%20Creation%20%26%20Application%20Deployment/17.png)
    
     - **Microsft Azure Subscription Section**
     
       From the line No.16 to line No.44 is the place for you to configure the resource needed by the Bridge Framework on your Microsoft Azure subscription.
       
         - **azureResources.tags**  (Line No.20 - No.23)
           
           This section is used to adding tags to the Microsoft Blob Storage service and Microsoft Bot Service that would be created by the automation pipeline. So that you could it to monitor the cost of these two services in the Microsoft Azure Cost Management console.
           
           - **azureResources.tags.sourceSystem**: any read friendly name of your sourcing SAP product. You could leave it as what it is for now.
           - **azureResources.tags.businessProcess**: any read friendly name of the business process you would like to integrated. You could leave it as what it is for now.
           
         - **azureResources.resourceGroup**  (Line No.24 - No.27)
         
           This section is used to configure the name of the Microsoft Azure resource group and it's location. The Bridge Framework automation pipeline will use it to create the resouce group with the name and location you given here.
           
           - **azureResources.resourceGroup.location**: **westus** or any location geographically near to you. 
           - **azureResources.resourceGroup.resourceGroupName**: any read friendly name. 
         
         - **azureResources.applicationRegistration** (Line No.28 - No.30)
         
           This section is used to configure the App Registration on Microsoft Azure. The Bridge Framework automation pipeline will use it to create the App Registration with the name you given here.
           
           - **azureResources.applicationRegistration.registrationName**: any read friendly name.
               
         - **azureResources.botService** (Line No.31 - No.34)
         
           This section is used to configure the Bot Service on Microsoft Azure. The Bridge Framework automation pipeline will use it to create the Azure Bot Service with the name you given here.
           
             - **azureResources.botService.botName**: any meaningful, ready freiendly name you would like to use. The Bridge Framework automation pipeline will create the bot service with the name you give here.
               
             - **azureResources.botService.connectionNamePrefix**: any meaningful, ready freiendly name you would like to use.

        - **azureResources.blobStorage** (Line No.35 - No.39)
        
          This section is used to configure the Blob Storage Service on Microsoft Azure. The Bridge Framework automation pipeline will use it to create the Blob Storage Account and Blob Storage Container with the name you given here.
          
          - **azureResources.blobStorage.blobStorageContainerName**: any meaningful, ready freiendly name you would like to use. The Bridge Framework will create the Azure Blob Storage container with the name you give here. **Please give the name all in lower-cases, and no logoner than 25 characters**.
          - **azureResources.blobStorage.blobStorageAccountName**: any meaningful, ready freiendly name you would like to use. The Bridge Framework will create the Azure Blob Storage account with the name you give here. **Please give the name all in lower-cases, and no logoner than 25 characters**.
          
        - **azureResources.enterpriseApp** (Line No.40 - No.43)
        
          This section is used to grant Microsoft Teams extension application's user access to the Azure Enterprise Application.
          
          - **azureResources.enterpriseApp.emails**:
            
            1. Add purchase order creator, purchase order approver's email address into this email array.

          - **azureResources.enterpriseApp.notificationEmail**:
            
            1. Add an email address that you would like to receive the notification of the system status, as this email will receive a notification when the active certificate is near the expiration date.

     - **Additional Automation Configuration Section**
     
       From the line No.45 to line No.60 is the place for you to configure the additional resources needed by the Bridge Framework on your SAP BTP subaccount.
       
       - **additionalAutomationConfiguration.queueCreation** (Line No.51 - No.54)
         
         This section is used to configure the Message Queue and the Webhook Subscription of the SAP Event Mesh Services. The Message Queueu will receive the purchase order & workflow instance data sending from SAP S/4HANA On-Premise system, and the Webhook subscription will be forwarding the message from message queue to the bridge framework backend service whish is hosted in your SAP BTP Subaccount.
         
         - **additionalAutomationConfiguration.queueCreation.subscription_name**: any meaningful, read freiendly name. The Bridge Framework automation pipeline will create the Webhook subscription on the message queue with the name you give here.
           
         - **additionalAutomationConfiguration.queueCreation.queue_name**:
           
           1. any meaningful, read freiendly name. The Bridge Framework will create the message queue in the SAP Event Mesh service with the name you give here. 
           
              > - **Note**
              > - The **format** of the **queue name** should be **namespace/queueName**. 
              > - **Please use the value of namespace as the one you give in default.json file line No.86**
              > - For example,
              > - If you define the **namespace** as **TISCE/bridgeframeworkEmClient/s4h**, and **queue name** as **purchase-order-approval**
              > - Then you should give value as **TISCE/bridgeframeworkEmClient/s4h/purchase-order-approval**

## 4. Trigger the Automation Tool Docker Container

As we already provided the SAP BTP subaccount and Microsoft Azure metadata within the automation tool configuration file, now it's time for us to run the automation tool container, let it create the resources on SAP BTP and Microsoft Azure for us, and deploy the extension application for us.

1. Open a new terminal in the VSC, and execute the command "**./btpsa**" under the root directory in the container.

2. There will be a link shows up in the terminal and asks you to do the manual login. Copy this link and open it in a browser, and click **Yes, log in to SAP BTP** button in the pop-up page in the browser.
    
    ![18](../assets/Resource%20Creation%20%26%20Application%20Deployment/18.png)
    ![19](../assets/Resource%20Creation%20%26%20Application%20Deployment/19.png)

3. After a while you will see there is a manual login request shows up in the terminal. This step is for Microsoft Azure Powershall authentication. Copy the authentication code and then open the URL in the browser to finish the manual Azure login.
    
    ![20](../assets/Resource%20Creation%20%26%20Application%20Deployment/20.png)
    ![21](../assets/Resource%20Creation%20%26%20Application%20Deployment/21.png)
    ![22](../assets/Resource%20Creation%20%26%20Application%20Deployment/22.png)

4. Then you will see another manual login request shows up in the terminal. This step is for Microsoft Azure CLI authentication. Copy the newly generated authentication code and URL into the browser, and finish the second time manual Azure login.
    
    ![23](../assets/Resource%20Creation%20%26%20Application%20Deployment/23.png)
    ![24](../assets/Resource%20Creation%20%26%20Application%20Deployment/24.png)
    ![25](../assets/Resource%20Creation%20%26%20Application%20Deployment/25.png)
    
5. After a while you will see the Microsoft Graph PowerShell login request. Copy the newly generated authentication code and URL into the browser, and finish the third time manual Azure login.
    
    ![26](../assets/Resource%20Creation%20%26%20Application%20Deployment/26.png)
    ![27](../assets/Resource%20Creation%20%26%20Application%20Deployment/27.png)
    ![28](../assets/Resource%20Creation%20%26%20Application%20Deployment/28.png)

6. Once the Microsoft Azure resource creation is done, the SAP BTP service instances creation and extension application deployment on SAP BTP side will begin. You will be ask to obtain an temporary authentication code by using the URL shows up in the terminal, and copy the code back to the terminal.
    
    ![29](../assets/Resource%20Creation%20%26%20Application%20Deployment/29.png)
    ![30](../assets/Resource%20Creation%20%26%20Application%20Deployment/30.png) 
    
7. Since the CF CLI will not hold your login credentials for a long time, so you will be asked again to provide your SAP BTP credentials like what we did in step 6 for several times. **Please keep an eye on the terminal and process it timely**. 
    
    - Bridge Framework Automation Pipeline actions which needs to perform manual BTP login:
        - Creating env in BTP
        
            ![31](../assets/Resource%20Creation%20%26%20Application%20Deployment/31.png)
            
        - Pushing applications to BTP account
        
            ![32](../assets/Resource%20Creation%20%26%20Application%20Deployment/32.png)
            
        - Getting key credentials
        
            ![33](../assets/Resource%20Creation%20%26%20Application%20Deployment/33.png)
       
8. After a while in the terminal you will see a text as **COMMAND EXECUTION: Uploading teams app package to MS Teams**. In this step the automation pipeline will upload the Microsoft Teams extension application to the Microsoft Teams automatically. This step requires login to the Microsoft Teams Cmdlet manually. Copy the authentication code and then open the URL in the browser to finish this step.

    ![34](../assets/Resource%20Creation%20%26%20Application%20Deployment/34.png)
    

9. Finally in your terminal you will see **SUCCESSFULLY FINISHED USE CASE EXECUTION**. This mean that all the resources creation and extension application deployment has been done successfully.  

    ![35](../assets/Resource%20Creation%20%26%20Application%20Deployment/35.png)
