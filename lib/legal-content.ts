export const companyInfo = {
  name: "The Alkebula School",
  motto: "Extraordinary Learning. Proven results.",
  address: "Britam Tower, 24th Floor, Upperhill, Nairobi, Kenya",
  email: "info@alkebulaschool.com",
  accountsEmail: "accounts@alkebulaschool.com",
  phone: "+254 728 866 097",
  facebook: "https://www.facebook.com/AlkebulaSchool/",
  linkedin: "https://www.linkedin.com/company/alkebulaschool",
  governingLaw: "Kenya",
} as const;

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  summary: string;
  effectiveDate: string;
  pdfHref: string;
  sections: LegalSection[];
};

export const legalDocuments = [
  {
    "slug": "terms",
    "title": "Terms and Conditions",
    "summary": "The legal agreement governing use of The Alkebula School platform and services.",
    "effectiveDate": "3 April 2026",
    "pdfHref": "/legal/terms.pdf",
    "sections": [
      {
        "heading": "Introduction",
        "paragraphs": [
          "These Terms and Conditions govern your access to and use of The Alkebula School website, platform, learning systems, tutor-introduction services, academic support services, consultancy services, and related services.",
          "The Alkebula School is a premium online education system offering structured academic support, tutoring, mentorship, and educational consultancy. By creating an account, booking a service, submitting an enquiry, or using the Platform, you agree to be bound by these Terms, the Privacy Policy, the Refund Policy, and the Code of Conduct.",
          "You must be at least 18 years old to enter into this Agreement. If a Student is under 18, a parent, legal guardian, or responsible adult must create the account, manage bookings, and remain responsible for the Student's use of the Platform."
        ]
      },
      {
        "heading": "Definitions",
        "paragraphs": [
          "Platform means The Alkebula School website, applications, systems, booking tools, dashboards, communication tools, payment flows, and related digital services.",
          "Student means the learner receiving tutoring, mentorship, consultancy, or academic support.",
          "Parent, Guardian, or Client means the person or organisation requesting, booking, paying for, or managing services for a Student.",
          "Tutor or Educator means an independent education professional providing teaching, tutoring, mentorship, assessment support, consultation, or related educational services through or in connection with the Platform.",
          "Services means all educational, administrative, consultancy, tutoring, mentorship, assessment, support, and related services offered or facilitated by The Alkebula School."
        ]
      },
      {
        "heading": "Platform Use and Eligibility",
        "paragraphs": [
          "Users must provide accurate, complete, and current information during registration, enquiry, booking, payment, and communication.",
          "Parents or guardians who allow a minor to use the Platform remain responsible for the minor's conduct, safety, account use, communications, bookings, and compliance with these Terms.",
          "We may update, modify, suspend, restrict, or discontinue any part of the Platform at any time where required for security, maintenance, service improvement, legal compliance, or business reasons.",
          "Although we make reasonable efforts to keep the Platform available, we do not guarantee uninterrupted, secure, error-free, or fault-free access."
        ]
      },
      {
        "heading": "Our Services",
        "paragraphs": [
          "In return for applicable fees, we may assemble, maintain, and present tutor profiles; facilitate tutor introductions; make the Platform available for booking and communication; support payments and administration; and provide education-related consultancy or academic support.",
          "We aim to introduce Students to suitable Tutors based on academic needs, curriculum, level, subject, availability, and other relevant factors. However, we do not guarantee that any particular Tutor will be available, suitable, or successful for every Student.",
          "Tutors are expected to use their professional discretion in choosing teaching methods, resources, and lesson approach based on the Student's needs and the agreed educational objective."
        ]
      },
      {
        "heading": "Tutor Status and Vetting",
        "paragraphs": [
          "Tutors are independent professionals and are not employees, agents, partners, or representatives of The Alkebula School unless expressly stated in writing.",
          "We may request identification, curriculum experience, academic qualifications, professional references, teaching history, profile photographs, criminal clearance or equivalent safeguarding documents, and other suitability information from Tutors.",
          "Vetting and document checks are conducted on a best-efforts basis. We do not guarantee that every document, qualification, professional claim, or background statement supplied by a Tutor is genuine, complete, or current.",
          "Parents and Students remain responsible for assessing whether a Tutor is suitable for their needs and for taking reasonable precautions in all online and in-person interactions."
        ]
      },
      {
        "heading": "Bookings, Communication, and Lessons",
        "paragraphs": [
          "Bookings, scheduling, rescheduling, cancellations, and material lesson communications should be handled through the Platform or through official The Alkebula School communication channels.",
          "Users are responsible for ensuring they can be contacted using the email address, phone number, or other contact details supplied to The Alkebula School.",
          "Where classes are recorded through an approved third-party classroom or video platform, recordings may be stored and made available according to that third-party provider's rules. We do not guarantee the quality, availability, or retention period of any recording.",
          "No class recording may be shared, published, copied, sold, transferred, or distributed without the express consent of all relevant participants and, where applicable, the consent of The Alkebula School."
        ]
      },
      {
        "heading": "Fees, Payments, and Taxes",
        "paragraphs": [
          "All fees must be paid using approved payment methods shown on the Platform or communicated through official The Alkebula School channels. Payment instructions from unofficial sources should not be relied upon.",
          "Payment information must be accurate, lawful, and belong to the person authorised to make payment.",
          "Payment processing may be handled by independent third-party payment providers. Those providers may store payment method details and process transactions under their own terms and policies.",
          "Unless expressly stated otherwise, quoted fees may include Tutor fees, Platform fees, administrative fees, applicable taxes, payment processing costs, or other service-related charges.",
          "Outstanding fees, chargebacks, failed payments, or shortfalls remain payable as debts owed to The Alkebula School or, where applicable, the relevant Tutor."
        ]
      },
      {
        "heading": "Refunds, Cancellations, and Absence",
        "paragraphs": [
          "Refunds and cancellations are governed by the Refund Policy, which forms part of these Terms.",
          "Unless a different written arrangement is agreed before lessons begin, at least 24 hours' notice is required for cancellation or rescheduling of a class by either party.",
          "Where a Student cancels or requests rescheduling with less than 24 hours' notice, the Student may be charged 50% of the lesson fee, or up to 100% at the Tutor's discretion, plus any agreed expenses already incurred.",
          "If a Tutor cancels, fails to attend, or materially fails to deliver an agreed lesson, the Student may request a replacement lesson, credit, or refund review under the Refund Policy.",
          "Refunds will normally be returned to the original payment method. Alternative refund methods may be used only where the original method is unavailable and after appropriate verification."
        ]
      },
      {
        "heading": "Academic Outcomes",
        "paragraphs": [
          "The Alkebula School does not guarantee any particular grade, examination result, school admission, university admission, certification, scholarship, employment outcome, or institutional decision.",
          "Educational progress depends on many factors including Student effort, attendance, baseline ability, parental support, curriculum demands, assessment requirements, Tutor fit, and institutional marking standards.",
          "Responsibility for academic performance, submitted work, attendance, and compliance with institutional rules remains with the Student and, where applicable, the Parent or Guardian."
        ]
      },
      {
        "heading": "User Content and Academic Integrity",
        "paragraphs": [
          "Users are responsible for all content, documents, assignments, messages, profile information, files, recordings, images, or materials they upload, share, submit, or make available through the Platform.",
          "Users must not submit content that infringes intellectual property rights, violates privacy, contains unlawful material, contains malicious code, or encourages academic misconduct.",
          "Tutors may support learning, revision, guidance, feedback, and academic development, but must not complete graded work on behalf of Students or facilitate plagiarism, cheating, impersonation, or dishonest academic conduct."
        ]
      },
      {
        "heading": "Privacy and Data Protection",
        "paragraphs": [
          "We process Personal Data in accordance with our Privacy Policy and applicable data protection law, including the Kenya Data Protection Act, 2019 where applicable.",
          "We may collect and process information required to respond to enquiries, match Students with Tutors, assess Tutor suitability, manage bookings, administer payments, improve services, comply with legal obligations, and protect users.",
          "By using the Platform, you acknowledge that Personal Data may be shared on a need-to-know basis with Tutors, Parents, Students, payment providers, technology providers, professional advisers, regulators, or other parties where lawful and necessary."
        ]
      },
      {
        "heading": "Intellectual Property",
        "paragraphs": [
          "All trademarks, branding, platform content, software, designs, text, graphics, logos, documents, resources, workflows, and other materials belonging to The Alkebula School remain our property or the property of our licensors.",
          "Users may not copy, modify, reproduce, publish, distribute, licence, sell, scrape, archive, or create derivative works from Platform content without prior written consent, except as required for normal personal use of the Services.",
          "User content remains owned by the relevant user, but the user grants The Alkebula School a limited licence to host, use, process, reproduce, and display such content where necessary to deliver and administer the Services."
        ]
      },
      {
        "heading": "Non-Solicitation and Circumvention",
        "paragraphs": [
          "Users must not bypass The Alkebula School by directly engaging, soliciting, hiring, paying, or contracting with any Tutor, Student, Parent, or Client introduced through the Platform, except with our prior written consent.",
          "This restriction applies during use of the Platform and for six months after the last introduction, booking, class, or termination of the relevant account, whichever is later.",
          "Where users make private arrangements outside the Platform, such arrangements are not protected, administered, supported, mediated, insured, or enforced by The Alkebula School, and we may suspend or terminate access."
        ]
      },
      {
        "heading": "Confidentiality",
        "paragraphs": [
          "Users must keep confidential any non-public information obtained through the Platform, including business information, pricing arrangements, Student information, Tutor information, personal information, learning plans, and internal processes.",
          "Confidential information may only be used for the purpose for which it was disclosed and must not be disclosed except where required by law or with written consent."
        ]
      },
      {
        "heading": "Suspension and Termination",
        "paragraphs": [
          "We may suspend or terminate access if we reasonably believe a user has breached these Terms, violated the Code of Conduct, failed to pay fees, created a safeguarding risk, misused the Platform, infringed rights, or acted unlawfully.",
          "A user may stop using the Platform at any time, but termination does not affect obligations that accrued before termination, including unpaid fees, confidentiality obligations, non-solicitation obligations, intellectual property obligations, cancellation charges, or liabilities."
        ]
      },
      {
        "heading": "Liability and Indemnity",
        "paragraphs": [
          "To the fullest extent permitted by law, the Platform and Services are provided on an 'as is' and 'as available' basis.",
          "We are not liable for Tutor conduct, Student conduct, user communications, academic outcomes, institutional decisions, third-party platforms, internet failures, device failures, data loss, software downtime, or indirect, consequential, special, or economic losses.",
          "Users agree to indemnify The Alkebula School against claims, losses, damages, liabilities, costs, and expenses arising from their breach of these Terms, misuse of the Platform, unlawful conduct, infringement of rights, or disputes with other users.",
          "Nothing in these Terms excludes liability where such exclusion would be unlawful."
        ]
      },
      {
        "heading": "Disputes",
        "paragraphs": [
          "Where a dispute arises between a Student, Parent, and Tutor, the parties should first attempt to resolve the matter respectfully and in writing.",
          "The Alkebula School may, at its discretion, investigate or mediate complaints, but is not obliged to compel refunds, enforce private agreements, or provide an alternative remedy unless required by law or expressly agreed in writing.",
          "Any discretionary offer made by The Alkebula School does not constitute admission of liability."
        ]
      },
      {
        "heading": "Governing Law and Jurisdiction",
        "paragraphs": [
          "These Terms are governed by the laws of Kenya.",
          "Subject to any mandatory consumer protection or data protection rights that may apply, the courts of Kenya shall have jurisdiction over disputes arising from these Terms or the Services."
        ]
      },
      {
        "heading": "Legal Notices and Contact",
        "paragraphs": [
          "Legal notices should be sent in English to info@alkebulaschool.com unless another official address is provided in writing.",
          "Payment-related communications may be sent to accounts@alkebulaschool.com.",
          "Users are responsible for keeping their contact details current. Notices sent to the most recent email address supplied by a user may be treated as validly delivered."
        ]
      },
      {
        "heading": "General Provisions",
        "paragraphs": [
          "If any provision of these Terms is found invalid or unenforceable, the remaining provisions will remain in effect.",
          "Our failure to enforce any provision is not a waiver of our right to enforce it later.",
          "Nothing in these Terms creates a partnership, joint venture, employment relationship, or agency relationship between The Alkebula School and any user, Tutor, Student, Parent, or Client.",
          "In case of conflict, these Terms take priority, followed by the Code of Conduct, Refund Policy, Privacy Policy, and any other policy issued by The Alkebula School, unless a specific written agreement states otherwise."
        ]
      }
    ]
  },
  {
    "slug": "refund-policy",
    "title": "Refund Policy",
    "summary": "How cancellations, rescheduling, credits, and refunds are handled.",
    "effectiveDate": "3 April 2026",
    "pdfHref": "/legal/refund-policy.pdf",
    "sections": [
      {
        "heading": "Purpose",
        "paragraphs": [
          "This Refund Policy explains how cancellations, rescheduling, missed lessons, refunds, credits, and payment reversals are handled for services offered or facilitated by The Alkebula School.",
          "This Policy forms part of the Terms and Conditions and should be read together with the Terms, Privacy Policy, and Code of Conduct."
        ]
      },
      {
        "heading": "Standard Cancellation Rule",
        "paragraphs": [
          "Unless otherwise agreed in writing before lessons begin, a minimum of 24 hours' notice is required to cancel or reschedule a lesson.",
          "Cancellation or rescheduling requests should be made through the Platform or through official The Alkebula School communication channels so that there is a clear record."
        ]
      },
      {
        "heading": "Late Cancellations by Students",
        "paragraphs": [
          "Where a Student, Parent, or Client cancels or requests rescheduling with less than 24 hours' notice, the Student may be charged 50% of the lesson fee, or up to 100% at the Tutor's discretion.",
          "Any agreed expenses already incurred in preparation for the lesson may also be payable.",
          "Repeated late cancellations may lead to restricted booking privileges, upfront payment requirements, or suspension of services."
        ]
      },
      {
        "heading": "Tutor Cancellation, Absence, or Non-Delivery",
        "paragraphs": [
          "Where a Tutor cancels with reasonable notice, the parties may agree to reschedule the lesson.",
          "Where a Tutor fails to attend, materially fails to deliver an agreed lesson, or cancels without reasonable notice, the Student may request a replacement lesson, credit, or refund review.",
          "Refunds in cases of unethical practice, safeguarding concerns, or clear non-delivery may be considered by The Alkebula School even where a Tutor disputes the refund request."
        ]
      },
      {
        "heading": "Refund Method",
        "paragraphs": [
          "Approved refunds will normally be returned to the original payment method used for the transaction.",
          "Refunds cannot normally be made to a different card, phone number, bank account, or third-party account unless required because the original payment method is unavailable and appropriate verification has been completed.",
          "Where a refund to the original method is not possible, The Alkebula School may request further information to process a bank transfer, mobile money reversal, payment gateway reversal, or other lawful refund method. Any transfer, bank, currency conversion, or payment provider charges may be deducted where applicable."
        ]
      },
      {
        "heading": "Platform Fees and Administrative Costs",
        "paragraphs": [
          "Where a lesson charge is amended or withdrawn, any associated platform fee may also be amended or withdrawn where appropriate.",
          "Payment gateway charges, bank charges, currency conversion costs, and administrative costs may be non-refundable where they have already been incurred, unless applicable law requires otherwise."
        ]
      },
      {
        "heading": "Prepaid Packages, Credits, and Bulk Bookings",
        "paragraphs": [
          "Prepaid lesson packages or account credits may be used for future lessons within the validity period stated at purchase or in the booking confirmation.",
          "Unused prepaid lessons may be refundable at our discretion, subject to deductions for lessons already delivered, late cancellations, administrative costs, payment processing fees, promotional discounts, and any agreed non-refundable components.",
          "Credits are not transferable to another person unless The Alkebula School agrees in writing."
        ]
      },
      {
        "heading": "Educational Consultancy and Assessment Services",
        "paragraphs": [
          "Fees for consultancy, placement support, assessment preparation, document review, learning plans, academic advisory work, or similar professional services may become non-refundable once work has begun.",
          "Where only part of the service has been delivered, The Alkebula School may consider a partial refund or credit based on the work already completed, time reserved, resources prepared, and any third-party costs incurred."
        ]
      },
      {
        "heading": "Technology Issues",
        "paragraphs": [
          "Students are responsible for having a stable internet connection, suitable device, working microphone/camera where needed, and access to any required learning tools.",
          "Where a lesson cannot proceed because of a Student-side technical issue, it may be treated as a late cancellation or missed lesson.",
          "Where a lesson cannot proceed because of a Platform-wide failure or Tutor-side technical failure, The Alkebula School may help arrange a rescheduled lesson, credit, or refund review."
        ]
      },
      {
        "heading": "How to Request a Refund",
        "paragraphs": [
          "Refund requests should be made in writing to info@alkebulaschool.com or accounts@alkebulaschool.com.",
          "Requests should include the Student name, Tutor name, lesson date and time, payment reference, reason for the request, and any supporting evidence.",
          "We aim to review refund requests fairly and may ask for further information from the Student, Parent, Tutor, payment provider, or relevant staff member."
        ]
      },
      {
        "heading": "Processing Timelines",
        "paragraphs": [
          "Approved refunds are processed through the applicable payment provider or bank. Timelines depend on the payment method, provider rules, banking system, and currency involved.",
          "The Alkebula School is not responsible for delays caused by banks, mobile money providers, payment processors, card networks, or incorrect payment details supplied by the user."
        ]
      },
      {
        "heading": "Abuse of Refund Process",
        "paragraphs": [
          "We may decline refund requests that are dishonest, abusive, excessive, unsupported, or inconsistent with attendance records, platform records, or communications.",
          "Any attempt to obtain a refund through false information, chargeback abuse, impersonation, or concealment may lead to suspension, termination, debt recovery, or legal action."
        ]
      }
    ]
  },
  {
    "slug": "privacy-policy",
    "title": "Privacy Policy",
    "summary": "How we collect, use, protect, and share personal information.",
    "effectiveDate": "3 April 2026",
    "pdfHref": "/legal/privacy-policy.pdf",
    "sections": [
      {
        "heading": "Overview",
        "paragraphs": [
          "This Privacy Policy explains how The Alkebula School collects, uses, stores, shares, and protects Personal Data when you enquire, register, use our Platform, book services, apply as a Tutor, visit our website, or communicate with us.",
          "By requesting or using our services, you acknowledge that we may process Personal Data as described in this Policy.",
          "We aim to collect only information that is relevant and necessary for providing our education services, maintaining trust and safety, complying with law, and improving the Platform."
        ]
      },
      {
        "heading": "Who This Policy Applies To",
        "paragraphs": [
          "This Policy applies to Students, Parents, Guardians, Clients, Tutors, prospective Tutors, job applicants, website visitors, and any other person who communicates with or uses The Alkebula School.",
          "Where a Parent or Guardian provides information about a minor, the Parent or Guardian confirms that they have authority to provide that information and to make decisions relating to the minor's use of the Services."
        ]
      },
      {
        "heading": "Information We Collect from Parents and Students",
        "paragraphs": [
          "When we receive an enquiry or booking, we may collect the Parent's or Client's name, contact details, gender where relevant, address or location, preferred curriculum, reason for seeking tuition, booking details, payment records, and communication history.",
          "For Students, we may collect name, school attended, age, date of birth, academic profile, curriculum, subjects, learning goals, performance information, special learning considerations supplied by the Parent or Student, and information needed to match the Student with a suitable Tutor.",
          "We may ask how you heard about us to thank referrers and improve advertising efficiency."
        ]
      },
      {
        "heading": "Information We Collect from Tutors and Prospective Tutors",
        "paragraphs": [
          "When Tutors apply or register, we may collect name, gender, address or location, city and country, contact details, email address, photograph, age, CV, certificates, academic history, employment history, schools attended, university education, degree courses, teaching experience, curriculum expertise, references, interests, professional memberships, teacher registration information, LinkedIn profile where provided, availability, rates, and bank or payment details.",
          "We may also collect safeguarding and suitability information, including criminal clearance certificates or local equivalents, reference information, identification, interview notes, and information relevant to teaching young people or vulnerable learners.",
          "Public Tutor profiles may include a photograph, first name or display name, subjects, curriculum experience, professional biography, qualifications, teaching style, and other approved profile information. We do not publish private contact details on public profiles."
        ]
      },
      {
        "heading": "Information from Website Visitors",
        "paragraphs": [
          "We may collect standard internet log information, device information, browser information, approximate location information, pages visited, referral sources, and visitor behaviour patterns.",
          "We may use cookies and analytics tools such as Google Analytics or similar services to understand website usage, improve performance, measure campaigns, and compile statistical reports.",
          "We do not intentionally use website analytics to identify individual visitors unless a visitor provides personal information through a form, account, booking, or direct communication."
        ]
      },
      {
        "heading": "How We Use Personal Data",
        "paragraphs": [
          "We use Personal Data to respond to enquiries, create and manage accounts, match Students with Tutors, administer bookings, process payments, provide academic support, manage Tutor applications, conduct interviews and checks, handle complaints, provide support, improve the Platform, prevent fraud, maintain safeguarding standards, send service updates, comply with legal obligations, and recover debts where necessary.",
          "We may use anonymised or aggregated data for internal analysis, service development, trend identification, planning, reporting, and marketing insights.",
          "We may send newsletters or educational updates to registered clients or people who opted in, and we will provide an option to opt out where required."
        ]
      },
      {
        "heading": "Legal Basis for Processing",
        "paragraphs": [
          "Depending on the circumstances, we may process Personal Data because it is necessary for a contract, because we have legitimate interests in providing and improving educational services, because we have legal obligations, because processing is needed to protect users, or because you have given consent.",
          "Where we rely on legitimate interests, we aim to balance our interests with your rights, freedoms, and reasonable expectations.",
          "Where consent is required, you may withdraw consent at any time, although this may affect our ability to provide certain services."
        ]
      },
      {
        "heading": "Sharing Personal Data",
        "paragraphs": [
          "We may share limited Personal Data with Tutors, Students, Parents, payment providers, technology providers, cloud hosting providers, analytics providers, email providers, professional advisers, regulators, law enforcement, and other parties where lawful and necessary.",
          "We share information on a need-to-know basis. For example, a Tutor may receive information needed to assess suitability for a Student, and a Parent may receive Tutor profile information needed to make an informed choice.",
          "We do not sell Personal Data to third parties."
        ]
      },
      {
        "heading": "International Transfers",
        "paragraphs": [
          "Because we operate online and may use international technology providers, Personal Data may be transferred to, accessed from, or stored in countries outside Kenya.",
          "Where we transfer data internationally, we take reasonable steps to ensure that Personal Data remains protected in accordance with this Policy and applicable law."
        ]
      },
      {
        "heading": "Data Security",
        "paragraphs": [
          "We use reasonable technical and organisational measures to protect Personal Data, including access controls, password authentication, restricted staff access, secure hosted infrastructure, encryption where appropriate, anti-malware tools, firewalls, and confidentiality obligations.",
          "No method of transmission over the internet is completely secure. We cannot guarantee absolute security while data is being transmitted by email, web forms, phone, messaging, or other communication methods."
        ]
      },
      {
        "heading": "Data Retention",
        "paragraphs": [
          "We retain Personal Data for as long as reasonably necessary to provide services, manage accounts, resolve disputes, comply with law, keep business records, maintain safeguarding records, enforce agreements, and protect our legitimate interests.",
          "Unsuccessful Tutor or job applicant information may be retained for a reasonable period for recruitment, safeguarding, legal, and record-keeping purposes.",
          "Billing, tax, transaction, safeguarding, legal, and dispute-related records may be retained even where a user asks us to delete other Personal Data, where retention is required or justified by law or legitimate interest."
        ]
      },
      {
        "heading": "Your Rights",
        "paragraphs": [
          "Subject to applicable law, you may request access to Personal Data we hold about you, correction of inaccurate data, deletion of data, restriction of processing, objection to processing, portability of certain data, and information about automated decision-making where applicable.",
          "To make a request, contact info@alkebulaschool.com. We may ask for proof of identity before responding.",
          "We aim to respond within applicable legal timelines, including the 30-day period referenced under Kenyan data protection practice where applicable."
        ]
      },
      {
        "heading": "Automated Matching and Profiling",
        "paragraphs": [
          "We may use simple matching tools or filters to help connect Students with Tutors based on subjects, curriculum, availability, level, location, experience, or stated preferences.",
          "Automated matching is intended to support service delivery and does not remove the need for human review, user discretion, and suitability assessment."
        ]
      },
      {
        "heading": "Children's Data",
        "paragraphs": [
          "We process children's information only where supplied by a Parent, Guardian, responsible adult, school, authorised representative, or where otherwise lawful.",
          "Parents and Guardians should ensure that information supplied about a child is accurate, relevant, and necessary for educational support."
        ]
      },
      {
        "heading": "Marketing, Remarketing, and Social Media",
        "paragraphs": [
          "We may use email, newsletters, social media, remarketing, or advertising tools to communicate educational updates, courses, programmes, or relevant services.",
          "Where required, we will ask for consent or provide an opt-out. We do not sell your information to advertisers.",
          "Our official social media pages include Facebook and LinkedIn links published on our website."
        ]
      },
      {
        "heading": "Data Breaches",
        "paragraphs": [
          "We maintain procedures intended to reduce the risk of data breaches.",
          "If a breach is likely to result in a high risk to the rights and freedoms of affected individuals, we will take appropriate steps, which may include notifying affected persons and/or relevant authorities where required by law."
        ]
      },
      {
        "heading": "External Links",
        "paragraphs": [
          "Our website may link to third-party websites, tools, payment providers, classroom platforms, or social media pages. We are not responsible for the privacy practices, content, or security of those third parties.",
          "Users should read the privacy notices of third-party websites and service providers they use."
        ]
      },
      {
        "heading": "Contact and Complaints",
        "paragraphs": [
          "Questions, access requests, privacy concerns, or complaints may be sent to info@alkebulaschool.com.",
          "You may also contact us by phone or WhatsApp on +254 728 866 097.",
          "If you are dissatisfied with how we handle your Personal Data, you may have the right to complain to the relevant data protection authority."
        ]
      }
    ]
  },
  {
    "slug": "code-of-conduct",
    "title": "Code of Conduct",
    "summary": "The standards of behaviour expected from all users of The Alkebula School.",
    "effectiveDate": "3 April 2026",
    "pdfHref": "/legal/code-of-conduct.pdf",
    "sections": [
      {
        "heading": "Overview",
        "paragraphs": [
          "This Code of Conduct applies to all users of The Alkebula School, including Students, Parents, Guardians, Clients, Tutors, prospective Tutors, staff, and any person using or communicating through the Platform.",
          "The purpose of this Code is to protect academic integrity, safety, professionalism, fairness, respectful communication, and trust within The Alkebula School community."
        ]
      },
      {
        "heading": "Honest and Accurate Information",
        "paragraphs": [
          "Users must ensure that all registration information, profile information, tutor information, academic information, booking information, advertisements, announcements, and direct communications are honest, accurate, current, and not misleading.",
          "Users must not supply false or misleading information about identity, qualifications, experience, purpose for using the Platform, academic level, payment details, or any other relevant matter.",
          "Users must not impersonate another person, Tutor, Student, Parent, staff member, institution, company, or entity."
        ]
      },
      {
        "heading": "Account Security",
        "paragraphs": [
          "Users must not allow another person to use their account, except that a Parent or Guardian may allow a minor Student to use the Parent's or Guardian's account for learning under supervision.",
          "Users must keep login details, passwords, and access credentials confidential and secure.",
          "If a user becomes aware of unauthorised access or suspects that login details have been compromised, the user must notify The Alkebula School promptly."
        ]
      },
      {
        "heading": "Respectful Conduct",
        "paragraphs": [
          "Users must behave with respect, professionalism, patience, and consideration toward Students, Parents, Tutors, staff, and all other users.",
          "Harassment, bullying, intimidation, discrimination, humiliation, threats, abusive language, sexual misconduct, exploitation, grooming, defamatory statements, or conduct likely to cause alarm, distress, or harm is prohibited.",
          "Users should attempt to resolve disagreements respectfully and should escalate serious concerns through appropriate The Alkebula School channels."
        ]
      },
      {
        "heading": "Academic Integrity",
        "paragraphs": [
          "Users must not request, offer, facilitate, or encourage plagiarism, cheating, impersonation, exam misconduct, falsification of results, completion of graded work on behalf of a Student, or any other form of academic dishonesty.",
          "Tutors may guide, teach, explain, review, mentor, and provide feedback, but must not misrepresent a Student's work as the Student's own where the Tutor substantially completed it.",
          "Students remain responsible for understanding and following the academic integrity rules of their schools, examination boards, universities, and institutions."
        ]
      },
      {
        "heading": "Safeguarding and Appropriate Boundaries",
        "paragraphs": [
          "Interactions involving minors must remain professional, appropriate, education-focused, and, where applicable, supervised by a Parent or Guardian.",
          "Tutors must not request unnecessary personal information from Students or engage in private, inappropriate, secretive, or non-educational communication with minors.",
          "Users must report safeguarding concerns, inappropriate behaviour, or suspected abuse to The Alkebula School promptly."
        ]
      },
      {
        "heading": "Communication Rules",
        "paragraphs": [
          "Users should communicate and schedule lessons through the Platform or official channels approved by The Alkebula School.",
          "Users must not share private contact details, payment instructions, social media handles, addresses, or other personal contact information for the purpose of bypassing the Platform or avoiding applicable fees.",
          "Unsolicited advertising, spam, promotional messages, or attempts to divert users away from The Alkebula School are prohibited."
        ]
      },
      {
        "heading": "Contributed Content",
        "paragraphs": [
          "Users must not upload, post, publish, transmit, or share content that is unlawful, defamatory, obscene, threatening, discriminatory, misleading, invasive of privacy, harmful to minors, or in breach of intellectual property rights.",
          "Users must not upload malware, viruses, harmful code, unauthorised recordings, stolen materials, confidential information, or content designed to interfere with the Platform."
        ]
      },
      {
        "heading": "Platform Integrity",
        "paragraphs": [
          "Users must not interfere with the proper working of the Platform, bypass access controls, scrape, crawl, reverse engineer, overload infrastructure, probe security systems, or attempt unauthorised access to data, accounts, systems, passwords, or networks.",
          "Users must not use the Platform for fraud, identity theft, unlawful activity, unethical conduct, or any activity that could harm The Alkebula School, its users, partners, systems, or reputation."
        ]
      },
      {
        "heading": "Payments and Non-Circumvention",
        "paragraphs": [
          "Users must not make, request, or facilitate private payment arrangements intended to bypass The Alkebula School's booking, payment, administration, or fee systems.",
          "Users introduced through the Platform must not directly solicit or contract with one another outside the Platform without prior written consent from The Alkebula School."
        ]
      },
      {
        "heading": "Consequences of Breach",
        "paragraphs": [
          "A breach of this Code may result in warning, removal of content, cancellation of bookings, suspension, termination of access, withholding of profile approval, refund refusal, reporting to relevant authorities, debt recovery, or legal action.",
          "The Alkebula School may act immediately where safety, safeguarding, fraud, serious misconduct, platform security, or legal compliance is at risk."
        ]
      },
      {
        "heading": "Reporting Concerns",
        "paragraphs": [
          "Concerns about misconduct, safeguarding, academic dishonesty, harassment, fraud, or platform misuse should be reported to info@alkebulaschool.com.",
          "Payment concerns may also be sent to accounts@alkebulaschool.com.",
          "Where urgent safety concerns exist, users should also contact the relevant emergency, safeguarding, or law enforcement authority."
        ]
      }
    ]
  }
] as const satisfies readonly LegalDocument[];

export function getLegalDocument(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}
