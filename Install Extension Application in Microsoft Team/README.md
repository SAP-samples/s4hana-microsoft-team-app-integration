# Install the SAP S/4HANA Extension Application in Microsoft Teams

The SAP S/4HANA extension application will be generated automatically after the Bridge Framework automation pipeline execution and ready to be installed in the Microsoft Teams app. User just need to download it from the automation pipeline docker container after the execution, and install it in the Microsoft Teams app. After the installation, they start use this extension application in Microsoft Teams and start perform their business.  

## 1. Download the zipped extension application

1. Go back to the automation pipeline docker container in the Visual Studio Code.

2.  **Expand btp-bridge-framework -> teams-app-package folder**, and **download** the **teams-app.zip** file to your local machine. This is the extension application that we will install in the Microsoft Teams app.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/210104395-ec9896d0-d53c-4de5-99ff-5f4977794312.png)

## 2. Install the Extension Application in Microsoft Teams

1. Login to the Microsoft Teams app. Click **Apps icon** on the left menu bar.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/210106988-0fc1ceab-131d-48e8-ae75-af96d4de09cc.png)

2.  Click **Manage your apps** button and then click the **Upload an app** icon.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/210107078-4da7cabf-3754-43b9-9c8c-4a49601cff9b.png)

3. Select **Upload a custom app**
    
    ![Capture](https://user-images.githubusercontent.com/29527722/210107141-e9f03a21-de88-446b-bd69-67c43db28a2f.PNG)

4. Select the **teams-app.zip** we just downloaded and then click **Add** button.
    
    ![Capture](https://user-images.githubusercontent.com/29527722/210107201-9886db35-5527-465a-a180-4cb6d5e7c465.PNG)

    ![Capture](https://user-images.githubusercontent.com/29527722/210107234-37733665-d153-4753-b490-323995fa79d0.PNG)
    
5. After the installation you should see there is an welcome card shows up automatically and we are all set for the extension application installation.
    
    ![Capture](https://user-images.githubusercontent.com/29527722/210107380-4679c787-f0b3-4e36-b687-f22f9aa41725.PNG)

## 3. SAP S/4HANA Extensiopn Application Validation

Lets do a quick validation on this extension application before we goes to the next step. For now we will validate whether we could fetch purchase order data from SAP S/4HANA system and displaying in this extension application.

1. Click **...** button on the bottom and then click the Bridge Framework icon
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/210107744-bad56829-2b71-43ea-8bfd-5cefa9c830d0.png)

2. Select Purchase Orders box.
    
    ![Capture](https://user-images.githubusercontent.com/29527722/210107806-0cd55d4d-1f44-4ce9-a016-8101765ea5cc.PNG)

3. Then we should see a table shows up and contains 400 purchase orders, this means that everything is working as desire. We are all set now.
    
    ![Capture](https://user-images.githubusercontent.com/29527722/210107953-24ac37d1-dc14-48c9-81e7-925fe75d71a3.PNG)

    
