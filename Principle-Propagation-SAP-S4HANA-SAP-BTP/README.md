# Principal Propagation Between SAP BTP and SAP S/4HANA On-Premise

In this section, we will focusing on set up the principal propagation between SAP Bussiness Technology Platform and SAP S/4HANA On-Premise system.

## 1. Establish trust between SAP BTP and SAP S/4HANA on-premise system 

1. Login to the **SAP S/4HANA On-Premise cloud connector administration console** and connect your BTP subaccount by clicking on the **Add Subaccount** button. Enter the details below and click on Save.
    
    > ### BTP subaccount information could be found on the SAP BTP Subaccount Overview page. 
    > - Region = Region of your SAP BTP subaccount. 
    > - Subaccount = ID of your SAP BTP subaccount. 
    > - Display name = A meaningful name. 
    > - Login E-mail = Email used to sign into SAP BTP. 
    > - Password = SAP BTP user password. 
    
    ![1](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/1.png)
    ![2](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/2.png)
2. Switch to the newly added subaccount, **create** the **self-signed system certificate** by going to **Configuration > ON PREMISE** and **clicking** on **Create and Import a self-signed certificate** button under **System Certificate** section. 
![3](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/3.png)
![4](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/4.png)

3. **Download** the generated **System Certification** by click **Download certificate in DER format** button. 
![5](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/5.png)

4. **Create** a **self-signed CA Certificate** by click **Create and import a self-signed certificate** button under **CA Certificate** section. 
![6](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/6.png)
![7](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/7.png)

5. **Download** the generated **CA certification** by click **Download certificate in DER format** button. 
![8](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/8.png)

6. Edit the **user mapping sample certificate** by using the **Edit** button under **Principal Propagation** section.  
    
    > ### Note
    > - Common Name = ${email} 
    > - Expiration Tolerance (h) = 2 
    > - Certificate Validity (min) = 60 
    
    ![9](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/9.png)
    ![10](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/10.png)
    
7. Create a **user mapping sample certificate** under **Principal Propagation** section by click **Create a sample certificate button**.  
![11](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/11.png)
8. Enter an **email** which is **registered under a user in SAP S/4HANA on-premise system** and click on **Generate** button. A sample mapping certificate will be downloaded. 
![12](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/12.png)

9. Under the **Cloud to On-Premise** section go to **PRINCIPAL PROPAGATION** section and click on **Synchronize** button to obtain the list of IdPs.
 ![13](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/13.png)

10. Add a mapping from virtual to internal system by clicking on **+** button under **Cloud to On-Premise > ACCESS CONTROL** section. 
![14](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/14.png)
    
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
    ![15](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/15.png)
11. Add resources of the virtual host by click **+** button. Set the **URL Path** to **/** and click on **Save** button.
![16](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/16.png)
 
12. Login to your SAP S/4HANA on-premise system using SAP GUI for Java. Use the transaction code **STRUST** to go to the **Trust Manager**. 
![17](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/17.png)

13. In the Trust manager screen import and add the System Certificate created in step 2.
    
    > ### In-order to complete this step, please following the steps below
    > - Click on **Display <-> Change** button to enable editing.
    > - Go to **SSL server Standard > System-wide > vhcals4hci_S4H_00**.
    > - Click the **Import Certificate** button and **import** the **System Certificate** created in **step 2**.
    > - Click on the **Add to Certificate List** button to register the system certificate. You can verify the newly added certificate under the Certificate List section. 
    > - Copy the **Subject** filed under the Certificate section and **note it down for later use**. 
    > - Click on the **Save** button to save changes.
    
    ![18](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/18.png)
14. Use the transaction code **/n/CERTRULE** to go to the **Rule Based Certificate Mapping**. 
![19](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/19.png)

15. In the **Rule Based Certificate Mapping** screen, **import** the **user mapping sample certificate** created in **step 7**

    > ### In-order to complete this step, please following the steps below.
    > - Click on **Display <-> Change** button to enable editing.
    > - Click the **Import Certificate** button and import the user mapping sample certificate created in **step 7**.
    > - Click on **+ Rule** button to add the rule.
    ![20](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/20.png)
    > - Select the **Certificate Attr.** as the **email address** from the dropdown. 
    > - Select the attribute **Login As**, as **E-mail**. 
    > - Click on the **Enter** button to create the rule. 
    ![21](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/21.png)
    > - Click on the **Save** button to save all changes. Observe that the mapped email exists in the SAP S/4HANA on-premise system. 
    ![22](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/22.png)
    
16. Use transaction **RZ10** to go to **Edit Profile** screen. 
![23](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/23.png)
17. Select the **ACTIVE** profile from the list. Name of the active profile in the system can be found on the system trace (log files). 
![24](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/24.png)

18. Select **Extended maintenance** and click on the **Change** button
![25](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/25.png)

19. Click on the **Create Parameter** button to add the reverse proxy trust configuration. 
![26](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/26.png)

20. **Add** the parameter name **icm/trusted_reverse_proxy_0** and the parameter value.
    > ### Parameter Value Syntax
    > - SUBJECT=“Subject-String” ISSUER=“Issuer-String” 
    > - **Subject-String** and **Issuer-String** must be **EXACLTY** same as it appears in **step 13** (including quotes, spaces etc.).  
    
    ![27](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/27.png)
    
    Click on **Copy** to save the parameter and go back to the profile maintenance screen. In the profile maintenance screen, click on the **Copy** button again to save the new parameter into the profile. 
    
21. Go back to the profile screen and click on the **Save** icon to activate the profile with reverse trust proxy configuration. 
![28](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/28.png)

22. Profile will be activated upon restarting the system. To restart the system, go to the transaction **SMICM**. 
![29](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/29.png)

23.  In the **ICM monitor** screen, select **Administration > ICM > Exit Soft > Global** to restart the system. 
![30](../assets/Principal%20Propagation%20Between%20SAP%20BTP%20and%20SAP%20S4HANA%20On-Premise/30.png)
