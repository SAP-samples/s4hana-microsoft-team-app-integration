# Principal Propagation Between SAP BTP and SAP S/4HANA On-Premise

In this section, we will focusing on set up the principal propagation between SAP Bussiness Technology Platform and SAP S/4HANA On-Premise system.

## Establish trust between SAP BTP and SAP S/4HANA on-premise system 

1. Login to the **SAP S/4HANA On-Premise cloud connector administration console** and connect your BTP subaccount by clicking on the **Add Subaccount** button. Enter the details below and click on Save.
    
    > ### BTP subaccount information could be found on the SAP BTP Subaccount Overview page. 
    > - Region = Region of your SAP BTP subaccount. 
    > - Subaccount = ID of your SAP BTP subaccount. 
    > - Display name = A meaningful name. 
    > - Login E-mail = Email used to sign into SAP BTP. 
    > - Password = SAP BTP user password. 
    
    ![Picture15](https://user-images.githubusercontent.com/29527722/205159373-758f0dc0-0845-44c4-8ecc-358288a5f43c.png)
    ![Picture16](https://user-images.githubusercontent.com/29527722/205159375-44fdb84d-5ab8-47ca-96fc-3254f647de3d.png)
2. Switch to the newly added subaccount, **create** the **self-signed system certificate** by going to **Configuration > ON PREMISE** and **clicking** on **Create and Import a self-signed certificate** button under **System Certificate** section. 
![Picture17](https://user-images.githubusercontent.com/29527722/205160312-5d9175e4-1655-451f-b783-365ce97e49e7.png)
![Picture18](https://user-images.githubusercontent.com/29527722/205160314-e0af9e48-9f77-4947-bb64-b9239e42c44f.png)

3. **Download** the generated **System Certification** by click **Download certificate in DER format** button. 
![Picture19](https://user-images.githubusercontent.com/29527722/205160638-00c4f489-1999-4641-aeb4-87b4dc0c8d62.png)

4. **Create** a **self-signed CA Certificate** by click **Create and import a self-signed certificate** button under **CA Certificate** section. 
![Picture20](https://user-images.githubusercontent.com/29527722/205160913-3bed4181-6b42-4587-a5a8-b4ad5199d5b1.png)
![Picture21](https://user-images.githubusercontent.com/29527722/205160918-3cc236c5-7e3d-4eec-88a6-47dc0cf31f8b.png)

5. **Download** the generated **CA certification** by click **Download certificate in DER format** button. 
![image](https://user-images.githubusercontent.com/29527722/205161162-fb695bc1-0b50-4994-ba8c-bc73f3f2dbc9.png)

6. Edit the **user mapping sample certificate** by using the **Edit** button under **Principal Propagation** section.  
    
    > ### Note
    > - Common Name = ${email} 
    > - Expiration Tolerance (h) = 2 
    > - Certificate Validity (min) = 60 
    
    ![Picture22](https://user-images.githubusercontent.com/29527722/205161685-c1d5c3be-3f91-4ce5-9e60-d13e936634de.png)
    ![Picture23](https://user-images.githubusercontent.com/29527722/205161687-182a2075-ce8c-4935-a779-5b5398a02a7a.png)
    
7. Create a **user mapping sample certificate** under **Principal Propagation** section by click **Create a sample certificate button**.  
![Picture24](https://user-images.githubusercontent.com/29527722/205161971-0606e2f6-add0-4b83-ad42-5ae5cc97b51a.png)
8. Enter an **email** which is **registered under a user in SAP S/4HANA on-premise system** and click on **Generate** button. A sample mapping certificate will be downloaded. 
![Picture25](https://user-images.githubusercontent.com/29527722/205162145-9864ee61-edfe-4b77-9bf0-cb981c72283d.png)

9. Under the **Cloud to On-Premise** section go to **PRINCIPAL PROPAGATION** section and click on **Synchronize** button to obtain the list of IdPs.
 ![Picture26](https://user-images.githubusercontent.com/29527722/205162291-9d353dd1-5955-4d23-8fb2-e3768c423819.png)

10. Add a mapping from virtual to internal system by clicking on **+** button under **Cloud to On-Premise > ACCESS CONTROL** section. 
![Picture27](https://user-images.githubusercontent.com/29527722/205162470-ac1dc9f0-0b46-4f3f-b038-429555655073.png)
    
    > ### Add the following values is the subsequent dialogs
    > - Back-end Type = ABAP System 
    > - Protocol = HTTPS 
    > - Internal Host = External IP Address of the SAP S/4HANA system. (SAP S/4HANA 2020 FPS02 & SAP HANA DB 2.0 External IP Address found under Appliances > Info section in Cloud Application Library console)
    > - Internal Port = Port number. Example: 44300. 
    > - Virtual Host = An read-friendly name. Example: s4hanaonprem. 
    > - Virtual Port = Port number. Ex. 44300. 
    > - Principal Type = X.509 Certificate (General Usage). 
    > - Host in Request Header = Use Virtual Host. 
    > - Enable Check Internal Host checkbox. 
    
    After that click on the **Save** button to save the virtual to internal system mapping.
    ![Picture28](https://user-images.githubusercontent.com/29527722/205163280-756b956d-8f19-4270-8d85-1b26ee7b390c.png)
11. Add resources of the virtual host by click **+** button. Set the **URL Path** to **/** and click on **Save** button.
![Picture29](https://user-images.githubusercontent.com/29527722/205163547-1ba03d8c-faab-4c04-a809-9bcfa1000f6a.png)
 
12. Login to your SAP S/4HANA on-premise system using SAP GUI for Java. Use the transaction code **STRUST** to go to the **Trust Manager**. 
![Picture30](https://user-images.githubusercontent.com/29527722/205164537-257e5411-0189-48ae-9385-fca9e3471c05.png)

13. In the Trust manager screen import and add the System Certificate created in step 2.
    
    > ### In-order to complete this step, please following the steps below
    > - Click on **Display <-> Change** button to enable editing.
    > - Go to **SSL server Standard > System-wide > vhcals4hci_S4H_00**.
    > - Click the **Import Certificate** button and **import** the **System Certificate** created in **step 2**.
    > - Click on the **Add to Certificate List** button to register the system certificate. You can verify the newly added certificate under the Certificate List section. 
    > - Copy the **Subject** filed under the Certificate section and **note it down for later use**. 
    > - Click on the **Save** button to save changes.
    
    ![Picture31](https://user-images.githubusercontent.com/29527722/205165304-2e38b291-bd9f-4131-8f72-8d9f8a537d87.png)
14. Use the transaction code **/n/CERTRULE** to go to the **Rule Based Certificate Mapping**. 
![Picture32](https://user-images.githubusercontent.com/29527722/205165477-47668a1a-d085-4855-b3a9-1bec21c4754b.png)

15. In the **Rule Based Certificate Mapping** screen, **import** the **user mapping sample certificate** created in **step 7**

    > ### In-order to complete this step, please following the steps below.
    > - Click on **Display <-> Change** button to enable editing.
    > - Click the **Import Certificate** button and import the user mapping sample certificate created in **step 7**.
    > - Click on **+ Rule** button to add the rule.
    ![Picture33](https://user-images.githubusercontent.com/29527722/205168379-cd62bb18-21fe-40e7-b9de-28e3929db8ef.png)
    > - Select the **Certificate Attr.** as the **email address** from the dropdown. 
    > - Select the attribute **Login As**, as **E-mail**. 
    > - Click on the **Enter** button to create the rule. 
    ![Picture34](https://user-images.githubusercontent.com/29527722/205168629-add29b2d-bf2f-4d18-b3d0-d37a41ebaa3a.png)
    > - Click on the **Save** button to save all changes. Observe that the mapped email exists in the SAP S/4HANA on-premise system. 
    ![Picture35](https://user-images.githubusercontent.com/29527722/205168834-0e4d39a1-19cf-4c22-9c8f-57e927677e68.png)
    
16. Use transaction **RZ10** to go to **Edit Profile** screen. 
![Picture36](https://user-images.githubusercontent.com/29527722/205169172-c32158b4-4e6d-4cc7-b9e8-211a55438a9c.png)
17. Select the **ACTIVE** profile from the list. Name of the active profile in the system can be found on the system trace (log files). 
![Picture37](https://user-images.githubusercontent.com/29527722/205169456-4143355c-aae5-466b-9589-1cf552479e23.png)

18. Select **Extended maintenance** and click on the **Change** button
![Picture38](https://user-images.githubusercontent.com/29527722/205169582-14590b8a-0c03-4aae-9b28-1c36ccec71ad.png)

19. Click on the **Create Parameter** button to add the reverse proxy trust configuration. 
![Picture39](https://user-images.githubusercontent.com/29527722/205171446-e00eedb4-b292-44b8-b412-638600f103db.png)

20. **Add** the parameter name **icm/trusted_reverse_proxy_0** and the parameter value.
    > ### Parameter Value Syntax
    > - SUBJECT=“Subject-String” ISSUER=“Issuer-String” 
    > - **Subject-String** and **Issuer-String** must be **EXACLTY** same as it appears in **step 13** (including quotes, spaces etc.).  
    
    ![Picture40](https://user-images.githubusercontent.com/29527722/205172477-68c58fc5-c922-442e-a7c8-96fe12e48f6d.png)
    
    Click on **Copy** to save the parameter and go back to the profile maintenance screen. In the profile maintenance screen, click on the **Copy** button again to save the new parameter into the profile. 
    
21. Go back to the profile screen and click on the **Save** icon to activate the profile with reverse trust proxy configuration. 
![Picture41](https://user-images.githubusercontent.com/29527722/205172735-693e69d2-d7b0-4889-b289-59b06e3d122b.png)

22. Profile will be activated upon restarting the system. To restart the system, go to the transaction **SMICM**. 
![Picture42](https://user-images.githubusercontent.com/29527722/205172873-d10be634-c209-409f-ba55-cd2953602d3e.png)

23.  In the **ICM monitor** screen, select **Administration > ICM > Exit Soft > Global** to restart the system. 
![Picture43](https://user-images.githubusercontent.com/29527722/205173041-9842bf5d-bd52-4f08-b351-383cd40f6da5.png)



## Create a destination on SAP BTP 

1. In the **SAP BTP subaccount**, go to **Connectivity > Cloud Connector** and verify that the Cloud Connector instance created in previous section is registered
![Picture44](https://user-images.githubusercontent.com/29527722/205173299-996b51a1-808c-48e4-b801-05064754a1e5.png)

2. Add a destination in **Connectivity > Destinations** section, using **New Destination** icon.
    > ### Please follow the steps below to enter the value for the destination.
    > - Name =  A meaningful name to your destination. 
    > - Type = HTTP 
    > - URL = http://<virtual-host>:<virtual -port> (created in previous section > Step 10) 
    > - Proxy Type = OnPremise 
    > - Authentication = PrincipalPropagation 
    > - Additional properties 
    > - sap-client = 100 
    > - sap-platform = ABAP 
    > - sap-sysid = S4H 
    
    Click on Save to save the newly created destination.
    ![Picture45](https://user-images.githubusercontent.com/29527722/205173743-98269215-1310-4860-a77e-2d730d48690e.png)
3. Check the connection to the destination service using either of the highlighted buttons and verify that the connection is successful.
![Picture46](https://user-images.githubusercontent.com/29527722/205173934-309c2243-65e4-4d7e-a87e-bcfd1a070e26.png)
