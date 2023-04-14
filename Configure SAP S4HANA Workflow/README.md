## Configure SAP S/4HANA Purchase Order Approval Flexible WorkFlow

In this section, we will focus on configure the purchase order approval flexible workflow in the SAP S/4HANA On-Premises System.

1. Log into the **SAP S/4HANA On-Premises Fiori Launchpad** as an adminstrator. In the Fiori Launchpad home page click on your name icon on the up-right conor and then click the **App Finder**
    ![1](../assets/Configure%20SAP%20S4HANA%20Workflow/1.png)

2. In the App Finder page search the **Manage Workflows for Purchase Orders**, select the one shows up under the Purchase Configuration section.
    ![2](../assets/Configure%20SAP%20S4HANA%20Workflow/2.png)

3. **Create a new purchase order approval workflow** by click the **Add** button.
    ![3](../assets/Configure%20SAP%20S4HANA%20Workflow/3.png)

4. In the New Workflow page, give the proper **Workflow Name**, **Description**, **Effective Date Rnage**, and **Start Conditions**.
    ![4](../assets/Configure%20SAP%20S4HANA%20Workflow/4.png)

5. Click **Add** button to add a new step for the workflow under the **Step Sequence** section
    ![5](../assets/Configure%20SAP%20S4HANA%20Workflow/5.png)

6. In the New Step page, please follow the instruction below to configure the step. Click the Add button on the bottom once done.
    
    > - Step Name: a meaningful name 
    > - Step Type: Release of Purchase Order
    > - Assignment By: User
    > - User: select the purchase order manager who will be responsible for release purchase order from the value help.
    > - Step Condiftions: Select one condition that could be a trigger for the this step.
    ![6](../assets/Configure%20SAP%20S4HANA%20Workflow/6.png)

7. Click the Save button on the bottom to save the new workflow.
    ![7](../assets/Configure%20SAP%20S4HANA%20Workflow/7.png)

8. Click the Activate button on the top to make the newly created workflow active and running.
    
    > Note
    > - You could not edit the workflow after activated it. Please double check the details of the workflow and steps before activate it.
    
    ![8](../assets/Configure%20SAP%20S4HANA%20Workflow/8.png)
    
9. Now in the Manage Workflows page, you could see thatthe status of the newly created workflow is active. 
    ![9](../assets/Configure%20SAP%20S4HANA%20Workflow/9.png)
