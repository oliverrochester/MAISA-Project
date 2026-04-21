This project was created with a mix of manual development and AI-assisted development using Cursor and Claude on the Sonnet 4.5 model

The parts of this project that were created with AI assistance were:

- Creating templates for files
- Generating generic tests to be built upon
- Debugging issues
- NumberWordSort algorithm
- Dynamic image creation

The parts of this project that I built myself were:

- Setting up the nextjs framework
- Building the front-end components
- Application directory structure
- Util function for the API endpoint
- Input validation edge cases
- Implementing the logic on how to display data on the frontend
- Jest test cases and reviewing/fixing AI built tests


Some of the things I had to fix/adjust that were produced by AI
- Tests cases that were created were submitting invalid inputs on tests that required valid inputs (eg. 100_000  -> 100000)

- Some of the tests that are validating functions were mocking response data instead of actually invoking the function to be tested
    - This required fixing the tests and actually invoking the function to get real test results

- Frontend input validation function that was built assumed a different data than what was actually being passed in 
    - if (parts.length === 0) --> if (parts.length === 1 && parts[0] == '')
    - handles case when user triggers sortText without inputting data
    - AI assumed there is nothing in the array in this case, when in reality there is actually an empty string in the array
    - This required a fix to output the correct error message to the user