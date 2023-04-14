# Setup SAP S/4HANA Testing Instance
If you apply an SAP S/4HANA testing system from the previous step, please following the instructions below to configure your new SAP S/4HANA instance.
> ### Prerequisites
> - Please have your SAP S/4HANA instance administrator credentials handy
> - Please also obtain the SAP GUI in-order to login to the new SAP S/4HANA testing instance.

### Activate the OData Service 
1. Log in to the SAP S/4HANA system using SAP GUI with your administrator user.
2. Enter the transaction code **/n/IWFND/MAINT_SERVICE** to start the **Activate and Maintain Services**
3. Make sure the OData service **API_PURCHASEORDER_PROCESS_SRV** is up and running with **OAuth Scope existes** checkbox checked. If you are **not seeing** this OData service listed, please add the service by clicking the **Add Service** button
![1](../assets/Setup%20SAP%20S4HANA%20Testing%20Instance/1.png)


### Create Users and Assign Permission.
In this mission, there are **two personas**, the **buyer** and the **purchases manager**. The buyer will perform the action of create the purchase order in the SAP S/4HANA system, and the purchases order manager will perform the acction of approve or reject the purchase order. Therefor, we will needs to create two user, one for buyer and one for purchases manager in the SAP S/4HANA system.

1. Enter the transaction code **/n/SU01** and start the **User Maintenance** screen in SAP S/4HANA instance.
2. Enter the user name and then click the Create button to create a user for buyer. 
![2](../assets/Setup%20SAP%20S4HANA%20Testing%20Instance/2.png)
3. Switch to the **Address** tab, give the **Last Name**, **First Name**, **Language** data in the **Person** section. In the Communication section, enter the user's email address at the **E-Mail Address** and then select **Method** as **E-MAIL**.
    > ### Note
    > - **The email address should be the email address for the user used in the Microsoft Teams App.**
    
    ![3](../assets/Setup%20SAP%20S4HANA%20Testing%20Instance/3.png)
4. Switch to the **Roles** tab, assign **Reference User** as **BPINST** to the user, so that the user could have all necessary permissions to create the purchase order in the  SAP S/4HANA testing instance.
    ![4](../assets/Setup%20SAP%20S4HANA%20Testing%20Instance/4.png)
5. Click on **Save** button to save the user for buyer. 
6. **Repeat the steps in this section to create another user for purchases manager**. Then we are all set. 
