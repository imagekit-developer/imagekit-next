## How it works

This is a simple Next.js app using latest version. In Github CI, we build the SDK and pack it. Then we install it in this test app and run the playwright tests.

We are using snapshot testing to verify the output generate by the SDK. This asserts the whole element along with all attributes instead of tons of assertions for each attribute.

Run the test app and manually verify the output before comming any changes in snapshots.

Also we add `color:red` styles in all Image because otherwise Next.js may add `color:transparent` styles to the image. This may causes flaky tests.