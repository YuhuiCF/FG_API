# FG_API


local.fairgarage.de

test.fairgarage.api.*** are the test pages for each API category


dev/ is the development folder

index.php is used to select which functions/categories to be built in the library.
It is, however, advised to run the CHECK before submitting the build.
It checks some basic structure of each function.

It calls the fairgarage.build.php file to do, with URL query containing function name.
The main object for the construction is in lib/FgApiLibrary.php.
The build file searches for functions constructed in files whose names start with "fairgarage.functions.".

Files whose names do not contain a dot (.) except for the extension, is a function category (named after directories of API path).
For new categories, just copy an existing category.

Files containing a dot in their names, are individual functions of each category.
For new functions, just copy the template file "fairgarage.functions_.template.php".
Please put the functions in the correct category, and name them with the function name containing in the file name.

You may use the file fairgarage.test.functions.php with URL query to see whether the output of a category/function is correct or not, during development.
Example: ?authentication/login
You are encouraged to do this during development.

After build, use the file js/fairgarage.js for tests.
It is recommended to store some backup files if they are good, from js/temp to js/backup.

After deployment, you have also the option to write the function descriptions into the function itself and make it accessible by calling the function with parameter "help".
It is also possible to make a minimized file of it.
