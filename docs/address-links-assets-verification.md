# Address, Links, Assets, And Form Verification

MIS-267 source check for the AIT USA refresh staging lane.

## Sources Checked

- Original Wix homepage: https://www.aitusainstitute.com/
- Original Wix English homepage: https://en.aitusainstitute.com/
- Original Wix contact page: https://en.aitusainstitute.com/contactanos
- Facebook profile link used by the refresh: https://www.facebook.com/aitusainstitute/
- Legacy placement exam Google Form: https://docs.google.com/forms/d/1B_rhVh4lmOIySRtOTOs1rrjas7vns9zRzamncquwcQg/viewform
- Legacy registration Google Form: https://docs.google.com/forms/d/1YurGiSiF03j2WZm2eABawja6FJ_8q5RrowbyQML_yN8/viewform

## Verified Contact Facts

- Central office phone: +1 732-271-0011.
- USA WhatsApp: +1 732-379-0593.
- Bound Brook: 213 E. Main St., Bound Brook, NJ 08805.
- Plainfield: 108 Watchung Ave., Plainfield, NJ 07060.
- Piscataway: 451 S. Washington Ave., Piscataway, NJ 08854.
- Flemington: listed only as Flemington, NJ, USA; keep as confirm-before-attending.
- New York: listed as online/headquarter support, not a walk-in street address.
- North Plainfield: not verified from the checked public source pages; keep pending and not shown as an active location.

The Wix homepage text contains one conflicting Bound Brook ZIP typo (`08885`), while the contact page and public social snippets use `08805`. The refresh keeps `08805`.

## Verified Class Hours

The original Wix homepage publishes class-hour blocks, not separate office hours:

- Monday through Thursday mornings: 8:30 am, 9:30 am, and 10:30 am.
- Monday through Thursday nights: 6:20 pm, 7:30 pm, and 8:40 pm.
- Saturdays: 10:00 am to 1:00 pm and 3:00 pm to 5:30 pm.
- Sundays: 10:00 am to 12:30 pm.

The refresh labels these as published class hours on active/online location cards.

## Google Forms

- The old `forms.level` URL was a Google Forms `/edit` URL. It now uses the public `/viewform` URL.
- The legacy placement form is public and titled `PLACEMENT EXAM (EXAMEN DE NIVELACION) COMMUNICATIVE ENGLISH`.
- The placement form includes student fields, level sections, grammar questions, and a free-writing section. The refresh `/placement-test` route remains a shorter on-site MVP until a full legacy-question migration is approved.
- The old `forms.offer` URL was also a Google Forms `/edit` URL. It now uses the public `/viewform` URL.
- The old `forms.registration` `/d/e/...` URL returned `Page Not Found`; the verified public registration form is the `1YurGiSi...` form titled `AiT USA Institute - Registración`.

## Asset Inventory

`npm run check:assets` is the acceptance guard for this slice. No new image/video asset references were introduced.
