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

1. **Alex** login to the SAP S/4HANA system and **created a new purchase order** with the **purchase order ID** as **4500001144**, and this purchase order is need purchase order approver Weikun's approval.

    ![Capture](https://user-images.githubusercontent.com/29527722/210622494-00ccad6d-c156-42b6-85a5-e08f64d73b5d.PNG)
    
2. **Weikun** as a purchase order approver **receives the notifcation card** in the Microsoft Teams. From the notifcation card he couold get the following brife information about the purchase order
    
    - Purchase Order Number
    - Purchase Order Creator Name
    - Purchase Order Creation Date
    - Priority of Purchase Order
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/210622839-edb2d694-8445-4513-83ac-2972be5314a3.png)
    
 3. **Weikun** could **look the purchase order details** information by clicking the **View More Details** button in the notification card.
     
     ![Capture](https://user-images.githubusercontent.com/29527722/210623031-f1386e25-5ef6-4416-818f-06697c090159.PNG)
     
     ![Capture](https://user-images.githubusercontent.com/29527722/210623217-484ef849-1216-4f7a-849e-66d86289dff8.PNG)
     
     ![Capture](https://user-images.githubusercontent.com/29527722/210623358-e3ee6afc-ea9a-42fe-9c1c-1115623442c6.PNG)

4. If Weikun needs have an discussion with the purchase order creator Alex regarding the purchase order, then he could simply forward this notification card to Alex and start the conversation by clicking the **Discuss** button, and then start the conversation with purchase order creator Alex
    
    ![tempsnip](https://user-images.githubusercontent.com/29527722/210623602-620f5b89-f23b-4d8b-83a9-dd721b037f32.png)

5. 
    

