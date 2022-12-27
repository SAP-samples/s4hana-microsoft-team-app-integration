# SAP BTP and Microsoft Azure Resources Creation  Bridge Framework Deployment

In this section, we will focus on using the automation tool to finish the resource creation on the SAP BTP and Microsoft Azure, and extension application deployment.

## 1. Prerequisites
1. Please make sure the have the docker and docker engine installed on your local machine. If you do not have the docker already installed, please follow the instruction below to install the docker in your local machine.
    
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

7. Click the **Instances and Subscription** button on the left panel, and then click the **Create** button on the right side to create a Event Mesh subscription.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208509636-ac9a5516-2dd0-4ad4-b0d7-e62f90ec863a.png)

8. In the **New INstances or Subscription** pop-up window window, select **Service** as **Event Mesh**, and **Plan** as **standard**. Click the **Create** button to create the subscription.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208510532-df03876c-1f17-4c25-95d3-f23983b90801.png)

9. Click **Security** -> **Users** button on the left panel, and make sure the user you are using has the following **Role Collections** list below.
    
    - **Enterprise Messaging Administrator**
    - **Enterprise Messaging Developer**
    - **Event Mesh Integration Administrator**
    - **Subaccount Administrator**
    - **Subaccount Service Administrator**
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208512357-a89f0d72-7eb5-418e-b8d0-16b458734a21.png)

## 2. Download the Automation Tool Docker Image

1. Download the automation tool docker image **bridge-automation-pipeline.tar.gz** from the [GitHub release](https://github.wdf.sap.corp/I568982/bridge-framework-automation/releases/tag/v1.0.1-alpha)
    
2. Open the CMD tool in your local machine, go into the directory where the downloaded docker image stored.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208526292-4389f31b-0c2d-4b9b-afff-65c3fd40e737.png)

3. Issue the command command below to load the docker image in your local machine.
    
    - **docker load -i ./bridge-automation-pipeline.tar.gz**
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208526799-f44d4757-84a1-4e98-a833-06c81067d565.png)

4. Issue the command below to start the docker container and run the image inside of the container. After the execution, you will see an container ID returned in the terminal.
    
    - **docker container run -e BTPSA_VERSION_GIT="\$(git describe --long --tags  --always)" --rm  -it -d --name bridge-automation-pipeline bridge-automation-pipeline** 

    ![Capture](https://user-images.githubusercontent.com/29527722/208529877-d69c415d-5477-4e54-9807-8b1fe891ee35.PNG)
    
## 3. Update the Automation Tool Configuration File 

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

4. Expend the **btp-bridge-framework -> config -> public** folder, **delete the existing backedn and frontend folder**. **Drag and drop** the following folders we got from this [step](https://flpnwc-ad17b8dc3.dispatcher.hana.ondemand.com/sites/admincenter#projectboard-Display&/masterboard/4164/card/9356957) under the **public** folder in the container.
    
    -  **backend**
    -  **frontend**
    -  **notification**
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208549375-3a3fcb46-7df9-48b8-aefb-455bad300835.png)
    
5. Open the **backend -> objectMappingConfig.json** we just dropped, update the **destinationName** value at **line 5** and **line 19** to the name of the destination we created during the **Principal Propagation Between SAP BTP and SAP S/4HANA On-Premise** step [section 2.2](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/blob/mission/Principle-Propagation-SAP-S4HANA-SAP-BTP/README.md#2-create-a-destination-on-sap-btp)

    ![tempsnip](https://user-images.githubusercontent.com/29527722/209711360-df00e910-5b81-4c5a-93d1-b7caaa39dbb4.png)
    ![tempsnip](https://user-images.githubusercontent.com/29527722/209711503-6937600c-f749-4191-a6bf-9c1ff71c19ac.png)

6. Open the **manifest.yaml** file under the root directory in the container. Please follow the instructions below to update the file.
    
    - a. Change **applications.name** at line 3 **from** ms-teams-us10-backend-automation-test **to** a meaningful name. **Note this value down**.
    - b. Update ms-teams-us10 to a meaningful value from line 10 to line 13. **Note those value down**.
    - c. Change **applications.name** at line 14 **from** ms-teams-us10-backend-automation-test **to** a meaningful name. **Note this value down**.
    - d. Change **applications.name** at line 20 **from** ms-teams-us10-backend-automation-test **to** a meaningful name. **Note this value down**.
    
    ![Capture](https://user-images.githubusercontent.com/29527722/208556959-ccab0379-503a-4bb2-8743-55fe74dcc60b.PNG)

7. Open the **parameters.json** file under the root directory in the container. This file is used to hold the data of your SAP BTP Subaccount and Microsoft Azure subscription. **The automation tool will use the value you give in this file to create resources on SAP BTP and Microsoft Azure, and deploy your extension application on SAP BTP**. 

    **Please follow the instruction below to update the variable's value in this file**.
    
    - **region**: the SAP BTP Subaccount region.
    - **globalaccount** : the SAP BTP global account name.
    - **subaccountid**: Subaccount ID shows on your SAP BTP subaccount Overview page.
    - **subaccountname**: Subdomain name shows on your SAP BTP subaccount Overview page
    - **orgid**: Org ID shows on your SAP BTP subaccount Overview page.
    - **org**: Org Name shows on your SAP BTP subaccount Overview page.
    - **cfcliapihostregion**: This value is part of API Endpoint. SOmethinkg like US20/US10
    - **cfspacename**: The space name we just created.
    - **myemail**: The email address you used to create the configured the SAP BTP Subaccount.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208554531-d287d165-1706-40b0-98ad-b0a6387c0d39.png)
    
    - **messagingEndpoint**: replace ms-teams-us10-backend-automation-test with the value you gave in the step 6.a, replace us10 to the cfcliapihostregion value you gave.
    - **providerScopeBaseUrl**: repleace ms-teams-us10-frontend-automation-test with the value you gave in the previous step 6.d, replace us10 to the cfcliapihostregion value you gave. 
    - **sapPlatformObjId**: the Microsoft Azure enterprise application object ID. You could find this value under App Registration -> Your Enterprise Application -> Overview page.
    - **replyUrlsPrefixes**: copy and paste the value of providerScopeBaseUrl, replace api:// with https://
    - **identifierUrisPrefixes**: copy and paste the value of providerScopeBaseUrl
    - **tokenExchangeUrlPrefix**: copy and paste the value of providerScopeBaseUrl
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208737058-aa342c59-d13f-4730-ad57-2226c1a2cf8a.png)
    
    - **pythonvars.app_names.backend**: the value you gave in the previous step 6.a
    - **pythonvars.app_names.config**: the value you gave in the previous step 6.c
    - **pythonvars.app_names.frontend**: the value you gave in the previous step 6.d
    - **pythonvars.envCreation.subscription_name**: this is the event mesh webhook name, you could give any meaningful name
    - **pythonvars.envCreation.endpoint**: this is the bridge framework backend api endpoint which will responsilbe for receive and process the message send by event mesh webhook. Replace ms-teams-us10-backend-automation-test with the value you gave in prevsiou step 6.a. Replace us10 with the cfcliapihostregion's value.
    - **pythonvars.envCreation.queue_name**: this value will apply to the message queue in the event mesh. You could give any ready friendly name.
    - **pythonvars.envCreation.sap_graph_instance_name**: delete this line.
    * **pythonvars.envCreation.saml_alias**:
      *  If you subaccount is hosted on AWS: (subaccountname).aws-live
      *  If you subaccont is hosted on Azure: (subaccountname).azure-(cfcliapihostregion)
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208741846-a97989dc-6231-4fe4-b9c2-26743a2baa32.png)

8. Open the **default.json** file under the **usecases -> released** folder. Follow the instructions below to update this file.
    
    * Update line 16 instance name with the value you give in manifest.yaml line 13
      
      ![tempsnip](https://user-images.githubusercontent.com/29527722/208743037-d81f4ef7-e27a-4038-816e-3dc286d08094.png)
      ![tempsnip](https://user-images.githubusercontent.com/29527722/208743263-46f5d19c-5782-4c9e-ac8a-09c20c9e2a5d.png)
      
    * Update line 23 instance name with the value you give in manifest.yaml at line 12.
    * Update line 43 instance name with the value you give in manifest.yaml at line 10.
    * Update line 51 instance name with the value you give in manifest.yaml at line 11.
    * Delete line 53 ~ line 60.
    * Update line 58 instance name with a meaningful name. 
    * Update line 61 emname with a meaningful name.
    * Update line 62 namespace with a meaningful name.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/208746148-d90228cc-8299-4211-879f-8a3ebd1fb48f.png)

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

    
