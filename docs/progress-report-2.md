Progress Report
- Increment 2 -
Group LeaseUpNoles


1)	Team Members
Name	FSU ID	GitHub IDS
Andrea Miranda	(acm23c)	 (andreacmiranda)
Jaylon Coad	(jxc22)	 (JaylonCoad)
Caleb Joseph	(Csj23a)	 (Caleb-Joseph)
Jonathan Norton	(jmn24)	 (jonathan-norton)
Pedro De Lana	(pd23b)	 (pedrode1ana)


2)	Project Title and Description

LeaseUpNoles - a Tallahassee-focused web app where FSU students can search off-campus housing by price and straight-line distance to campus, and read reviews left by other students who've actually lived there

3)	Accomplishments and overall project status during this increment 
During this increment, our team moved from setup into building the application. We finished the project scaffold, connected the app to Supabase through environment variables, and added a health check to confirm the connection. We also set up our GitHub project board and a deploy pipeline in Vercel, so the main branch deploys to production and every pull request gets its own preview.
We then built out the database. We created the tables for listings, user profiles, and reviews, added a read policy so listings can be viewed publicly, and wrote a seed script that loads about 20 realistic Tallahassee listings. Each listing now stores its straight-line distance to campus, calculated with the Haversine formula.
With the foundation in place, we built the core of the student experience. Students can sign up, log in, and log out through Supabase Auth, browse all listings, and open a detail page for any listing. The browse page now has price and distance range sliders, a bedroom selector, and sorting by price, distance, or average rating. We also completed a responsive pass so the site works on mobile devices.
We also made progress on our documentation. The Requirements Document now includes functional and non-functional requirements, use cases, class and sequence diagrams, the operating environment, and assumptions. The Implementation and Testing Document now covers our programming languages, platforms, APIs, and databases.
Overall, the core browsing experience is complete and deployed, and the project's scope has not changed. All 31 of our automated unit tests for distance, filtering, and sorting are passing. Our remaining core work is student review submission, admin tools, the full set of database security rules, and the updated documentation. We will move into that work next.
4)	Challenges, changes in the plan and scope of the project and things that went wrong during this increment

Challenges: Our challenges this increment were mostly individual ones, such as debugging our own code and working through problems as they came up in each person's assigned feature. As a team, we worked more cohesively than we did in the first increment. Now that we are past the logistics of working together, each person's work has moved through GitHub issues and pull requests into the shared codebase.

Changes in plan or scope: There were no changes to the project's scope during this increment. The features we proposed are still our target. The one change is in timing: the review features, admin tools, and full security rules that we had planned for this increment are still open and will carry into the next one, because this increment went toward completing the app's foundation and browsing experience.

Things that went wrong: Nothing major went wrong. The setback from the last increment was resolved, as the Supabase integration has now been verified and the deployed app can read our listings from the database.

5)	Team Member Contribution for this increment
•	Andrea Miranda: Built the listing detail page (Issue #10), completed the responsive and mobile-first layout pass (Issue #11), and wrote the non-functional requirements for the Requirements Document (Issue #14).
•	Jaylon Coad: Wrote the seed script for Tallahassee listings (Issue #8), added the public read policy for listings (Issue #52), wrote the functional requirements (Issue #13), completed the Requirements Document with use cases, class and sequence diagrams, environment, and assumptions (Issues #15 and #16), and managed pull request merges.
•	Pedro De Lana: Scaffolded the Next.js and TypeScript project (Issue #1), built the browse and search page (Issue #9), completed the filter controls (Issue #20), and added sorting (Issue #21).
•	Jonathan Norton: Connected the app to Supabase and added the health check (Issue #2), integrated sign up, log in, and log out (Issue #7), set up the Vercel deploy pipeline (Issue #12), and wrote Sections 1–2 of the Implementation and Testing Document (Issue #17).
•	Caleb Joseph: Set up the GitHub project board (Issue #4), created the database schema (Issue #5), and implemented and tested the Haversine distance calculation with stored listing distances (Issue #6).

6)	Plans for the next increment
In the next increment, our team plans to finish the core features of the application. First, we will build the review form (Issue #22), display reviews and average ratings on the listing detail page (Issue #23), and add review validation (Issue #24). We will then complete the Row-Level Security policies (Issue #25) and build the admin tools for managing listings and moderating reviews (Issues #26 and #27).
We will also expand our seed data (Issue #28), add the remaining unit tests (Issue #29), and update the Requirements Document and the Implementation and Testing Document (Issues #30–33).
Once the core features are in place, we will move into quality and final delivery: accessibility and responsive checks, a security and input-validation audit, full regression testing, code cleanup, and documentation of known issues (Issues #40–44), followed by the final documents, progress report, and demo video (Issues #45–48). If time allows, we will also work on our stretch features: saved listings, side-by-side comparison, a map view, and real driving and walking distances (Issues #36–39).

7)	Stakeholder Communication
To our stakeholders,
Here's a brief update on Lease Up Noles, our platform to help FSU students find off-campus housing in Tallahassee and share honest reviews of where they've lived.
Progress so far
The website is now live, and the main experience is in place. Students can create an account, log in, browse Tallahassee listings, and open a page with the details of each one. They can narrow their search by rent, number of bedrooms, and distance to campus, and sort the results by price, distance, or rating.
Where we stand
The features we originally promised are all still planned, and none have been cut. Our team is also working together more smoothly now that we've settled into a shared routine.
A small delay
Student reviews and the tools for managing listings took a back seat this round while we finished the search experience they depend on. Much like a house needs its walls up before the finishing work can begin, reviews need listings and accounts to attach to. Those pieces are now in place, and reviews are our top priority going forward.
Next steps
•	Let students write and read reviews of the places they've lived
•	Add tools for our team to manage listings and remove inappropriate reviews
•	Strengthen protections around who can view and change information
•	Test the full site for security, accessibility, and reliability
If you have insight into what students would find most helpful in a review of their housing, we'd love to hear it as we build this feature.
Best regards,
The Lease Up Noles Team

8) Link to video
https://drive.google.com/file/d/1apGZwxQeytJlRq8J58Rbmq89V2XPpHNN/view?usp=sharing

