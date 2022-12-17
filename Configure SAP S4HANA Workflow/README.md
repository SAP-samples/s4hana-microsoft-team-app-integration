## Configure SAP S/4HANA Purchase Order Approval Flexible WorkFlow

In this section, we will focus on configure the purchase order approval flexible workflow in the SAP S/4HANA On-Premises System.

1. Log into the **SAP S/4HANA On-Premises Fiori Launchpad** as an adminstrator. In the Fiori Launchpad home page click on your name icon on the up-right conor and then click the **App Finder**
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207414908-9c6184f6-2b13-4884-a5b8-86e2818d7f02.png)

2. In the App Finder page search the **Manage Workflows for Purchase Orders**, select the one shows up under the Purchase Configuration section.
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207415632-c6ab44ff-f160-40aa-aa78-07f66a9223e2.png)

3. **Create a new purchase order approval workflow** by click the **Add** button.
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207416414-753ea006-523d-43f5-9b8a-9d5a579e1507.png)

4. In the New Workflow page, give the proper **Workflow Name**, **Description**, **Effective Date Rnage**, and **Start Conditions**.
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207418128-7008aa51-97e6-425d-9f6f-cf6f4f851540.png)

5. Click **Add** button to add a new step for the workflow under the **Step Sequence** section
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207419665-d57dc9c0-0d01-4962-a388-041456b2220e.png)

6. In the New Step page, please follow the instruction below to configure the step. Click the Add button on the bottom once done.
    
    > - Step Name: a meaningful name 
    > - Step Type: Release of Purchase Order
    > - Assignment By: User
    > - User: select the purchase order manager who will be responsible for release purchase order from the value help.
    > - Step Condiftions: Select one condition that could be a trigger for the this step.
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207422699-f17f48a0-1a24-410d-9456-07d022f5e2f4.png)

7. Click the Save button on the bottom to save the new workflow.
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207423052-cc8c5c02-e03b-4daa-a61b-8ebf72fa88ff.png)

8. Click the Activate button on the top to make the newly created workflow active and running.
    
    > Note
    > - You could not edit the workflow after activated it. Please double check the details of the workflow and steps before activate it.
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207423446-dd0bfb45-a320-4fee-a1ec-6ed35ef4a5bb.png)
    
9. Now in the Manage Workflows page, you could see thatthe status of the newly created workflow is active. 
    ![tempsnip](https://user-images.githubusercontent.com/29527722/207424091-c9eda3f1-3496-4b8b-a172-32fee1db446c.png)
