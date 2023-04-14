# Install the SAP S/4HANA Extension Application in Microsoft Teams

The SAP S/4HANA extension application will be generated automatically after the Bridge Framework automation pipeline execution and ready to be installed in the Microsoft Teams app. User just need to download it from the automation pipeline docker container after the execution, and install it in the Microsoft Teams app. After the installation, they start use this extension application in Microsoft Teams and start perform their business.  

## 1. Download the zipped extension application

1. Go back to the automation pipeline docker container in the Visual Studio Code.

2.  **Expand btp-bridge-framework -> teams-app-package folder**, and **download** the **teams-app.zip** file to your local machine. This is the extension application that we will install in the Microsoft Teams app.
    
    ![1](../assets/Install%20Extension%20in%20MS%20Teams/1.png)
    
3. **Open** the **manifest.json** file in the **teams-app.zip** you just downloaded. **Updates** the **isNotificationOnly** value to **false**. Save the changes. 
    
    ![2](../assets/Install%20Extension%20in%20MS%20Teams/2.png)
    
    ![3](../assets/Install%20Extension%20in%20MS%20Teams/3.png)
    
    ![4](../assets/Install%20Extension%20in%20MS%20Teams/4.png)

## 2. Install the Extension Application in Microsoft Teams

1. Login to the Microsoft Teams app. Click **Apps icon** on the left menu bar.
    
    ![5](../assets/Install%20Extension%20in%20MS%20Teams/5.png)

2.  Click **Manage your apps** button and then click the **Upload an app** icon.
    
    ![6](../assets/Install%20Extension%20in%20MS%20Teams/6.png)

3. Select **Upload a custom app**
    
    ![7](../assets/Install%20Extension%20in%20MS%20Teams/7.png)

4. Select the **teams-app.zip** we just downloaded and then click **Add** button.
    
    ![8](../assets/Install%20Extension%20in%20MS%20Teams/8.png)

    ![9](../assets/Install%20Extension%20in%20MS%20Teams/9.png)
    
5. After the installation you should see there is an welcome card shows up automatically and we are all set for the extension application installation.
    
    ![10](../assets/Install%20Extension%20in%20MS%20Teams/10.png)

## 3. SAP S/4HANA Extensiopn Application Validation

Lets do a quick validation on this extension application before we goes to the next step. For now we will validate whether we could fetch purchase order data from SAP S/4HANA system and displaying in this extension application.

1. Click **...** button on the bottom and then click the Bridge Framework icon
    
    ![11](../assets/Install%20Extension%20in%20MS%20Teams/11.png)

2. Select Purchase Orders box.
    
    ![12](../assets/Install%20Extension%20in%20MS%20Teams/12.png)

3. Then we should see a table shows up and contains 400 purchase orders, this means that everything is working as desire. We are all set now.
    
    ![13](../assets/Install%20Extension%20in%20MS%20Teams/13.png)

    
