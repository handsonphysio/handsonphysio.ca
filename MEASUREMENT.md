# Optional website measurement

All eight HTML pages load `measurement.css` and `measurement.js`. There is no build step. GitHub Pages publishes the repository root on `main` to handsonphysio.ca.

The production Google Analytics web stream is `G-VLPZR721SK`, also installed through Jane's Google Analytics integration. Measurement uses basic consent mode: the Google script is loaded only after the visitor chooses **Allow measurement**. **No thanks** leaves it unloaded. Privacy choices can be reopened, and withdrawal clears this website's Google measurement cookies and reloads the page to unload the vendor.

The choice is saved in this browser's first-party local storage for up to 180 days when storage is available. It does not set or withdraw choices on Jane's separate domain. Personalized advertising and Google Signals are disabled. Google Analytics Enhanced Measurement is disabled in the stream settings; keep form, site-search and outbound-click collection disabled. No input from the clinic assistant or booking forms is collected by this code.

Only ad/linker identifiers are retained in the measured page URL. Other query parameters and fragments are excluded; the measured referrer is reduced to its origin. Development previews outside handsonphysio.ca and www.handsonphysio.ca do not load Google.

Cross-domain linking is maintained in the Google tag settings for:

- handsonphysio.ca
- www.handsonphysio.ca
- handsonphysio.janeapp.com

After accepting measurement, verify that a normal booking-link click receives a `_gl` parameter and opens Jane. The tag loads asynchronously, so a click immediately after acceptance can precede linker initialization. Ad blockers, consent choices and Jane's own implementation also affect attribution.

The GA4 `appointment_booked` key event is configured centrally from Jane's confirmation-page page view. This website never emits a booking event for a link click. The Google Ads import stays secondary until real paid-booking attribution is validated.

Run the dependency-free consent checks with Node.js:

```sh
node --test tests/measurement.test.cjs
```

Check initial, declined, accepted and withdrawn choices in a browser after changes, including a narrow mobile viewport. Do not create test patient bookings in the live clinic account.
