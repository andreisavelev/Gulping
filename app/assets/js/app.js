require.conf({
	baseUrl: "src/bower/",

	paths: {
		"jquery" : "jquery/jquery"
	}
});

define(["jquery"], function ($) {
	if($)
	console.log($);
});
/*
echo "# Gulping" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:savelevcorr/Gulping.git
git push -u origin master
…or push an existing repository from the command line


git remote add origin git@github.com:savelevcorr/Gulping.git
git push -u origin master
*/