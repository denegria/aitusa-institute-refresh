# AIT Client questions before meeting July 13

Prepared for the Monday, July 13 client meeting.

Goal: answer the decisions that are blocking the AIT USA refresh site, placement test, payments, student portal, and launch plan. Keep the conversation simple and focused. If the client is unsure, mark the item as `defer` and assign a follow-up owner.

## Recommended Meeting Order

1. Placement test.
2. Payments and student payment history.
3. Locations, phone numbers, and hours.
4. Homepage and client feedback.
5. Launch timing and domain.

## Top Decisions Needed

1. Should the refresh placement test be fully on the site, with no external form or embedded form?
2. Should AIT staff confirm each placement result before enrollment?
3. Should online payments start only after staff confirms the student, class, price, and schedule?
4. Should we use Stripe first for online payment links, while keeping Clover for in-person card payments and recording Zelle/cash manually?
5. Should North Plainfield stay hidden until the exact address, hours, and service status are confirmed?
6. What homepage changes are approved now, and what should wait until after the client reviews the next design pass?
7. What launch date or launch window should we work toward?

## Placement Test

Simple client framing:

The new site should not send students to an outside form. Students should answer the placement questions directly on the AIT USA website. The site can suggest a level, but AIT staff can still confirm the final level before enrollment.

Questions:

1. Do you approve replacing the old external placement form with an on-page questionnaire on the AIT USA website?
2. Should the new questionnaire be shorter and easier than the old one, or should it keep most of the same questions?
3. What should the placement test measure?
   - Grammar?
   - Reading?
   - Writing?
   - Speaking confidence?
   - Listening confidence?
   - Student goal?
4. Do you have the official answer key for the old placement questions?
5. Who should approve the answer key before we use it on the new site?
6. Should the site show the student an immediate suggested level?
7. What level names should the student see?
   - Beginner?
   - Basic?
   - Intermediate?
   - Advanced?
   - AIT's own level names?
8. Should every placement result say that an advisor must confirm the final class level?
9. Should the student answer a short writing prompt in the first version?
10. If the student writes an answer, who reads it?
11. Should the placement test ask for:
    - Name?
    - Phone?
    - Email?
    - City?
    - Age group?
    - Course goal?
    - Preferred schedule?
12. After the test, should the next step be:
    - WhatsApp message to an advisor?
    - A staff call?
    - A registration/payment step?
    - All of the above?
13. Later, should placement test results be saved in AIT CRM?
14. If yes, what staff member or team should receive the placement follow-up task?

## Payments And Student Payment History

Simple client framing:

Student payment history means a simple list for each student showing what they were charged, what they paid, how they paid, what is still owed, and any refunds. It is like a small account statement for each student.

### Current Payments

1. How do students pay today?
   - Clover/card in person?
   - Zelle?
   - Cash?
   - Checks?
   - Anything else?
2. Which payment method do students use most often?
3. Who receives payments today?
4. Who records payments today?
5. When a student pays by Zelle, where is it written down?
6. When a student pays cash, where is it written down?
7. Do students receive receipts today?
8. If yes, are receipts:
   - Printed?
   - Emailed?
   - Texted?
   - Handwritten?
   - From Clover?

### Online Payment Goal

1. What should the website help students pay first?
   - Registration plus book?
   - Monthly tuition?
   - A payment plan installment?
   - A custom amount approved by the office?
2. Can students pay online before speaking with the office?
3. Or should staff first confirm the student, class, price, and schedule, then send a payment link?
4. Should the public website show a general "Pay now" button?
5. Or should payment links only be sent by staff after review?
6. Is the `$95 registration + book` amount still correct and public?
7. Are there different registration, book, or tuition prices by course or location?

### Stripe, Clover, And Other Processors

Simple client framing:

For the first online payment version, we recommend Stripe because it is usually
the fastest way to create a secure payment link and send it to a student. Clover
can still stay in use for in-person card payments. Zelle and cash can still be
recorded by staff.

1. Are you comfortable using Stripe for online payment links?
2. Should Clover stay as the in-person card payment system?
3. Should Zelle and cash still be accepted and entered manually by staff?
4. Does the current Clover account support online payment links or online checkout?
5. Can Clover send a payment link by text or email?
6. Can Clover show what student or class a payment belongs to?
7. Can Clover handle a custom amount, like a partial tuition payment?
8. Can Clover notify our system automatically when a payment succeeds, fails, or is refunded?
9. What are the current Clover online fees?
10. Can the client share a recent Clover processing statement or online pricing page so we can compare it against Stripe if needed?
11. If Clover online is easier or much cheaper than Stripe, should we use Clover online instead?

### Payment Requests

Simple client framing:

A payment request means the office creates an amount for a specific student and sends that student a link to pay.

Questions:

1. Who should create payment requests?
   - Admin?
   - Advisor?
   - Teacher?
2. Should every payment request be connected to a student name?
3. Should every payment request say what it is for?
   - Registration?
   - Book?
   - Monthly tuition?
   - Missed balance?
   - Other?
4. Should students be allowed to pay less than the requested amount?
5. Should payment requests expire after a certain number of days?
6. Should staff be able to cancel a payment request?
7. Should students receive payment requests by:
   - Text?
   - WhatsApp?
   - Email?
   - Student portal?

### Student Payment History

1. Should staff be able to open a student record and see all payment history in one place?
2. Should card, Zelle, and cash payments all appear together?
3. Should staff manually add cash and Zelle payments?
4. Should staff see the student's remaining balance?
5. Should parents, spouses, or employers be allowed to pay for a student?
6. Should the payer name be saved when someone else pays for the student?
7. Should students be able to see their own payment history later in the student portal?

### Receipts

1. What should each receipt show?
   - Student name?
   - Course or class?
   - Location?
   - Amount paid?
   - Payment method?
   - Remaining balance?
2. Should receipts be in Spanish, English, or both?
3. Should Stripe or the payment processor send the receipt?
4. Should AIT CRM also show or send a receipt copy?
5. Should staff receive a copy of every receipt?

### Payment Plans, Balances, And Late Payments

1. Are payment plans common?
2. Are payment plans fixed amounts or flexible amounts?
3. Are due dates required?
4. Are late fees used?
5. Should the system warn staff when a student has a balance due?
6. Should unpaid balances ever block portal access or class access?
7. Should students get payment reminders?
8. If yes, by text, WhatsApp, email, or all of them?

### Refunds, Failed Payments, And Mistakes

1. Who approves refunds?
2. Should refunds be handled only inside Clover or the payment processor first?
3. Should AIT CRM only record that a refund happened?
4. What should happen when an online payment fails?
5. Who should be notified when a payment fails?
6. Who is allowed to correct a payment mistake?
7. Should corrections remain visible in the student payment history for safety?

## Locations, Phone Numbers, And Hours

Simple client framing:

We need to confirm what locations are active, what contact information is correct, and whether the hours shown on the old site are class hours or office hours.

### Active Locations

1. Confirm Bound Brook is active:
   - 213 E. Main St., Bound Brook, NJ 08805.
2. Confirm Plainfield is active:
   - 108 Watchung Ave., Plainfield, NJ 07060.
3. Confirm Piscataway is active:
   - 451 S. Washington Ave., Piscataway, NJ 08854.
4. Confirm Flemington status:
   - Is it active?
   - Is it by appointment?
   - Is there a full street address?
5. Confirm New York / Online status:
   - Is this online support only?
   - Is there a walk-in location?
6. Confirm North Plainfield:
   - Is it active?
   - If yes, what is the exact address?
   - What phone number and hours should be shown?
   - If no, should it stay hidden for now?

### Phone And WhatsApp

1. Is this the correct main phone number?
   - +1 732-271-0011
2. Is this the correct WhatsApp number?
   - +1 732-379-0593
3. Should every location show the same phone and WhatsApp?
4. Are there location-specific phone numbers?
5. What number should appear on the website header and footer?

### Hours

The old site shows these as class hours:

- Monday through Thursday mornings: 8:30 am, 9:30 am, and 10:30 am.
- Monday through Thursday nights: 6:20 pm, 7:30 pm, and 8:40 pm.
- Saturdays: 10:00 am to 1:00 pm and 3:00 pm to 5:30 pm.
- Sundays: 10:00 am to 12:30 pm.

Questions:

1. Are these class hours correct?
2. Are these hours the same for every location?
3. Are there separate office hours?
4. If there are office hours, what are they?
5. Should the website say "class hours" instead of just "hours"?
6. Are weekend classes available at every location?

## Homepage And Client Feedback

Simple client framing:

The homepage is still being refined. We need to know what is approved now, what needs changes, and what should wait.

Questions:

1. What do you like about the current refresh homepage?
2. What do you dislike or want changed?
3. Is the first screen clear enough for a new student?
4. Does the homepage explain the student's problem well?
5. Does it explain why AIT USA is different?
6. Are the videos and testimonials approved for the site?
7. Are any images or videos not approved?
8. Which action should be most important on the homepage?
   - Take placement test?
   - Talk to an advisor on WhatsApp?
   - Register and buy the book?
   - View courses?
9. Is the registration/book offer still correct?
10. Should pricing be shown publicly on the homepage?
11. Is there any wording that feels too strong, too weak, or inaccurate?
12. Are there any Spanish wording changes the client wants?
13. Should the website mention future student portal features?
14. Should the website mention future AI study/practice tools, or keep that private for now?

## Courses And Offerings

Simple client framing:

We need to confirm which programs are active now, which ones are future programs, and which ones should be promoted most.

Questions:

1. Confirm the active course list:
   - English for adults and young adults?
   - English for kids?
   - GED?
   - Basic computing / office computing?
   - Computer repair?
   - Spanish for foreigners?
   - Online or hybrid English?
2. Which courses are most important to promote first?
3. Are any listed courses no longer active?
4. Are any courses missing?
5. Are course names correct?
6. Are course durations correct?
7. Are course schedules correct?
8. Should prices be shown publicly for any courses?
9. Should online courses be positioned as active now or coming soon?
10. Should technical/computer courses be shown as main programs or secondary programs?

## Lead And Contact Follow-Up

Simple client framing:

When someone asks for information on the site, we need to decide where that request goes and who follows up.

Questions:

1. Should website leads go into AIT CRM later?
2. Until CRM capture is approved, should WhatsApp remain the immediate handoff?
3. What information is required before staff follows up?
   - Name?
   - Phone?
   - Email?
   - Course interest?
   - Preferred location?
   - Preferred schedule?
4. Who should receive new website leads?
5. Should leads create a task for an advisor?
6. What should happen if a student submits the form twice?
7. What consent text should the form show before someone submits?
8. Should SMS/text marketing opt-in be separate from normal contact permission?

## Student Portal And Future Features

Simple client framing:

The portal is a future student area. Students may eventually sign in to see classes, attendance, lessons, payments, and practice tools. We need to confirm priorities before building too much.

Questions:

1. Which portal features matter most first?
   - Student sign-in?
   - Attendance?
   - Lesson recaps?
   - Video modules?
   - Placement test result history?
   - Payments and receipts?
   - AI study buddy?
   - Profile/settings?
2. Should teachers be able to post lesson recaps?
3. Should students see attendance history?
4. Should parents or guardians have access for minors?
5. Should students see payment history in the portal?
6. Should any portal features be mentioned publicly as "coming soon"?
7. Are there privacy rules for minors that we should know before building portal features?
8. Should audio/speaking practice be saved, or should it be temporary only?

## Launch, Domain, And Final Approval

Simple client framing:

Before replacing the old Wix site, we need final approval, a domain plan, and a rollback plan.

Questions:

1. What is the target launch date or launch week?
2. Should Wix stay live until the new site is fully approved?
3. What domain should the new refresh use at launch?
4. Should the new site replace the old Wix site completely?
5. Who gives final launch approval?
6. What screenshots or pages does the client want to review before launch?
7. Who owns analytics access?
8. Who owns Google Search Console or SEO access?
9. Should the launch happen during business hours or after hours?
10. If something breaks after launch, who should be contacted first?
11. What is the rollback plan if launch has a serious issue?

## Meeting Decision Log

Use this during the call.

### Decision 1

- Topic:
- Client answer:
- Decision: approve / reject / defer
- Follow-up owner:
- Notes:

### Decision 2

- Topic:
- Client answer:
- Decision: approve / reject / defer
- Follow-up owner:
- Notes:

### Decision 3

- Topic:
- Client answer:
- Decision: approve / reject / defer
- Follow-up owner:
- Notes:

### Decision 4

- Topic:
- Client answer:
- Decision: approve / reject / defer
- Follow-up owner:
- Notes:

### Decision 5

- Topic:
- Client answer:
- Decision: approve / reject / defer
- Follow-up owner:
- Notes:

## Internal Source Notes

- This packet compiles open questions from the refresh strategy, placement-test handoff, payment/CRM memo, address/link verification, lead/contact handoff, student portal plan, and current Linear issue state.
- The old Wix placement questionnaire is source material only. The refresh product should use AIT USA's own on-page questionnaire, not an embedded or linked external form.
- Do not enable payment capture, live CRM writes, durable placement storage, or production launch until the relevant decisions above are approved.
