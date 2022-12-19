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

    
    
