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

1. **Alex** as a purchase order creator login to the SAP S/4HANA system and **created a new purchase order** with the **purchase order ID** as **4500001144**, and this purchase order is need purchase order approver Weikun's approval.

    ![1](../assets/E2E%20Testing/1.png)
    
2. **Weikun** as a purchase order approver **receives the notifcation card** in the Microsoft Teams. From the notifcation card he couold get the following brife information about the purchase order
    
    - Purchase Order Number
    - Purchase Order Creator Name
    - Purchase Order Creation Date
    - Priority of Purchase Order
    
    ![2](../assets/E2E%20Testing/2.png)
    
 3. **Weikun** could **look the purchase order details** information by clicking the **View More Details** button in the notification card.
     
     ![3](../assets/E2E%20Testing/3.png)
     
     ![4](../assets/E2E%20Testing/4.png)
     
     ![5](../assets/E2E%20Testing/5.png)

4. If **Weikun** needs have an discussion with Alex regarding the purchase order, then he could simply forward this notification card to Alex and start the conversation by clicking the **Discuss** button, and then **start the conversation** with purchase order creator **Alex**
    
    ![6](../assets/E2E%20Testing/6.png)
    
    ![7](../assets/E2E%20Testing/7.png)

5. **Alex** will receive the notification card forwarded by Weikun and Weikun's question in the chat. If he needs to recall the details of the purchase order before reply to Weikun, then he could simply click on the **Go to PO button** in the notification card. This will **re-direct** Alex back to the **SAP S/4HANA Manage Purchase Order** app and then displaying the purchase order details data.
    
    ![8](../assets/E2E%20Testing/8.png)
    
    ![9](../assets/E2E%20Testing/9.png)

6. **Weikun** could then approve/reject the purchase order by clicking the Approve or Reject button based on the Alex's reply.
    
    ![10](../assets/E2E%20Testing/10.png)
    
    ![11](../assets/E2E%20Testing/11.png)

7. **Weikun** rejects the purchase order and inform Alex with the reason. The approval status of the purchase order will also updated both in the notification card and in the SAP S/4HANA system. 
    
    ![12](../assets/E2E%20Testing/12.png)
    
    ![13](../assets/E2E%20Testing/13.png)
    
