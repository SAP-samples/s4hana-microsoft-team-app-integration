# Principal Propagation Between SAP BTP and Microsoft Azure

In this section, we will focus on set up the principal propagation between Microsoft Azure and SAP Business Technology Platform (BTP).

### Establish the Trust Between SAP BTP and Microsoft Azure
1. Go to your SAP BTP subaccount and download the **SAML Metadata** under **Security** > **Trust Configuration**. 
![tempsnip](https://user-images.githubusercontent.com/29527722/205149136-6aac631b-82bf-4e47-95a6-ac53cab72564.png)

2. Then, go to **Microsoft Azure portal** and search for **Enterprise Applications** in the search bar. Select the **Enterprise applications** under Services. 
![Picture2](https://user-images.githubusercontent.com/29527722/205131651-4d8ffaa2-a749-49ca-bea5-67c0a44a3567.png)

3. Create a new enterprise application by clicking on the **New Application** button.
![Picture3](https://user-images.githubusercontent.com/29527722/205131831-193baef3-a4a3-4e98-9bcb-8095af154e19.png)

4. Search for **SAP Cloud Platform** enterprise application in Azure AD gallery. 
![Picture4](https://user-images.githubusercontent.com/29527722/205144866-8a6bf8b1-147c-44f2-b3b9-4fa92eeacc33.png)

5.Give an appropriate name for the registration and click on **Create**. 
![Picture5](https://user-images.githubusercontent.com/29527722/205145162-f4f3b5da-ed72-43e5-b5d0-e2c296a3694d.png)

6. In the newly created enterprise application, go to **Single sign-on** and select the **SAML** tile. 
![Picture6](https://user-images.githubusercontent.com/29527722/205145320-f6c48a10-b3d4-4b6e-87bf-602d33246efb.png)

7. Click on the **Upload metadata file** button and upload the SAML metadata file downloaded in step 1. 
![Picture7](https://user-images.githubusercontent.com/29527722/205145493-ce3eda5c-d63f-49fc-bc37-b37c654da5aa.png)

8. **Edit** the **Basic SAML configuration** and **edit** the **Reply URL** to **change** the URI from **/saml/sso/** into **/oauth/token/**.  
![Picture8](https://user-images.githubusercontent.com/29527722/205145928-ff8eae65-ae5f-4181-a257-3a35a2348a3f.png)

9. Add the **Sign on URL** in the format https://"btp-subaccount-name".authentication."btp-subaccount-region".hana.ondemand.com. 
    > Note
    > - Replace the "btp-subaccount-name" and "btp-subaccount-region" to your BTP subaccount name & subaccount region name.
    > - The above sign on URL can also be found on the url attribute of the service key created within the XSUAA instance bound to the Bridge Framework’s backend application.
    
    
    ![Picture9](https://user-images.githubusercontent.com/29527722/205146773-f0430632-72c5-4f26-820b-22f1fc1d8215.png)
    **You may test the Single sign-on using the pop up which shows up upon saving the SAML Configuration**.
10. Edit the **Attributes & Claims** section and change the **Unique User Identifier** from **user.userprincipalname** into **user.mail**. Save the settings. 
![Picture10](https://user-images.githubusercontent.com/29527722/205147326-a5c45c0b-f102-4d63-add7-0c5045ba17b5.png)
![Picture11](https://user-images.githubusercontent.com/29527722/205147328-a503a495-93b0-433e-a4b8-85f40299c2a1.png)


11. Download the **Federation Metadata XML**. 
![Picture12](https://user-images.githubusercontent.com/29527722/205147539-1f2ba5fb-86de-4906-931f-7edc2877c16a.png)

12. Go to your **BTP subaccount** and under **Security > Trust Configuration** section, **upload** the **Federation Metadata XML** file downloaded in step 11, by clicking New **Trust Configuration** button. 
![Picture13](https://user-images.githubusercontent.com/29527722/205147844-0620906c-d9c4-4013-971c-186994ec453b.png)

13. Give the trust configuration an appropriate Name and **disable Available for User Logon** option. Click on **Save**. (Link text for user logon could be same as origin key).  
![Picture14](https://user-images.githubusercontent.com/29527722/205148056-ec4f28f6-673c-495e-9ebb-4bf37b486a59.png)

14. Go back to the **enterprise application** we just created on the **Microsoft Azure**, Click **Users and Groups** on the left menu bar, and then add the purchase order creator and purchase order approver user into the enterprise by click the **Add user/group** button.

    ![tempsnip](https://user-images.githubusercontent.com/29527722/209204711-499790e4-74f0-4531-9661-eb67823c28cc.png)
