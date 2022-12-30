# Approval SAP S/4HANA Purchase Order in Microsoft Teams

In this section, we will go through the use case of approve SAP S/4HANA purchase order in Microsoft Team from end to end. 

**Steps** includes from the End-to-End:
- Purchase Order Creator creates purchase order in SAP S/4HANA system.
- Purchase Order Approver receives the notification card in Microsoft Teams.
- Purchase order Approver forwards thenotification card with Purchase Order Creator and discusss newly created purchase order.
- Purchase Order Approver make a decision to approve/reject the purchase order.

**Personas** in this section are:
- Purchase Order Creator: Alex
- Purchase Order Approver: Weikun

**Purchase Order Approval Flow Trigger Condition**
- Any **purchase order** with the **amount of value large than 100 USD** will needs purchase order approver's approval.

## 1. Prerequisites

1. Please make sure that both **purchase order creator** and **purchase order approvers** are **install the extension application** in their Microsoft Teams. 
    
    > - Please send **team-app.zip** file that we downloaded from previous tutorial [Install the SAP S/4HANA Extension Application in Microsoft Teams section 1.2](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Install%20Extension%20Application%20in%20Microsoft%20Team#1-download-the-zipped-extension-application) to your purchase order creator and purchase order approvers. 
    > - The extension application installation process would be the same as what we did in the previous tutorial [Install the SAP S/4HANA Extension Application in Microsoft Teams section 2](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Install%20Extension%20Application%20in%20Microsoft%20Team#2-install-the-extension-application-in-microsoft-teams).

## 2. End-to-End Flow

1. **Alex** login to the SAP S/4HANA system and **created a new purchase order** with the **purchase order ID** as **4500001142**, and this purchase order is need purchase order approver Weikun's approval.

    ![Capture](https://user-images.githubusercontent.com/29527722/210117193-298eb6f2-33cd-4955-801f-b99caa2eb1a7.PNG)
    
2. **Weikun** as a purchase order approver **receives the notifcation card** in the Microsoft Teams. From the notifcation card he couold get the following brife information about the purchase order
    
    - Purchase Order Number
    - Purchase Order Creator Name
    - Purchase Order Creation Date
    - Priority of Purchase Order
    
    ![Capture](https://user-images.githubusercontent.com/29527722/210117388-25e2a548-eb8c-4d80-b8bd-da961cc1247b.PNG)
    
 3. **Weikun** cloud **look the purchase order details** information by clicking the **View More Details** button in the notification card.
     
     ![Capture](https://user-images.githubusercontent.com/29527722/210117449-63fc307a-f703-4600-9529-9eb8cea3bcf8.PNG)
     
     ![Capture](https://user-images.githubusercontent.com/29527722/210117467-c71ecebd-b973-4763-af19-1b9a49a21e55.PNG)
     
     ![Capture](https://user-images.githubusercontent.com/29527722/210117483-c182d0c5-094e-4c53-97e4-e3082127401c.PNG)

4. If Weikun needs have an discussion with the purchase order creator Alex regarding the purchase order, then he could simply forward this notification card to Alex and start the conversation by clicking the **Discuss** button.
    
    ![Capture](https://user-images.githubusercontent.com/29527722/210117598-ea8da4ca-e8b5-4d96-bd9d-15a1cedba44f.PNG)

    

