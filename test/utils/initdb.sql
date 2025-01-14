-- Adminer 4.8.1 PostgreSQL 14.7 dump

DELETE FROM "contesttable";
INSERT INTO "contesttable" ("contestnumber", "contestname", "conteststartdate", "contestduration", "contestlastmileanswer", "contestlastmilescore", "contestlocalsite", "contestpenalty", "contestmaxfilesize", "contestactive", "contestmainsite", "contestkeys", "contestunlockkey", "contestmainsiteurl", "updatetime") VALUES
(0,	'Fake contest (just for initial purposes)',	1677698467,	0,	0,	0,	1,	1200,	100000,	'f',	1,	'',	'',	'',	1677698467),
(1,	'Contest Alpha',	0,	11264340,	11263440,	11260740,	1,	1200,	100000,	't',	1,	'[d3g22q]',	'',	'http://a.b',	1678879816),
(2,	'Contest Beta',	0,	3600,	0,	0,	5,	12000,	1000,	'f',	2,	'',	'',	'',	1678879893);

DELETE FROM "langtable";
INSERT INTO "langtable" ("contestnumber", "langnumber", "langname", "langextension", "updatetime") VALUES
(1,	1,	'C',	'c',	1677698473),
(1,	2,	'C++11',	'cc',	1677698473),
(1,	3,	'Java',	'java',	1677698473),
(1,	4,	'Python2',	'py2',	1677698473),
(1,	5,	'Python3',	'py3',	1677698473),
(2,	1,	'C',	'c',	1677698547),
(2,	2,	'C++11',	'cc',	1677698547),
(2,	3,	'Java',	'java',	1677698547),
(2,	4,	'Python2',	'py2',	1677698547),
(2,	5,	'Python3',	'py3',	1677698547);

DELETE FROM "sitetable";
INSERT INTO "sitetable" ("contestnumber", "sitenumber", "siteip", "sitename", "siteactive", "sitepermitlogins", "sitelastmileanswer", "sitelastmilescore", "siteduration", "siteautoend", "sitejudging", "sitetasking", "siteglobalscore", "sitescorelevel", "sitenextuser", "sitenextclar", "sitenextrun", "sitenexttask", "sitemaxtask", "updatetime", "sitechiefname", "siteautojudge", "sitemaxruntime", "sitemaxjudgewaittime") VALUES
(1,	2,	'127.0.0.1/boca',	'Site B',	't',	't',	11263440,	11260740,	11264340,	't',	'2',	'2',	'2',	3,	0,	0,	0,	0,	10,	1678879693,	'',	'f',	600,	900),
(1,	3,	'127.0.0.1/boca',	'Site C',	't',	't',	11263440,	11260740,	11264340,	't',	'3',	'3',	'3',	3,	0,	0,	0,	0,	10,	1678879701,	'',	'f',	600,	900),
(2,	5,	'127.0.0.1/boca',	'Local site',	't',	't',	0,	0,	3600,	't',	'5',	'5',	'5',	3,	0,	0,	0,	0,	10,	1678879720,	'',	'f',	600,	900),
(2,	2,	'127.0.0.1/boca',	'Main site',	't',	't',	0,	0,	3600,	't',	'2',	'2',	'2',	3,	0,	0,	0,	0,	10,	1678879720,	'',	'f',	600,	900),
(0,	1,	'',	'Fake Site (just for initial purposes)',	't',	't',	0,	0,	1,	't',	'1',	'1',	'0',	4,	0,	0,	0,	0,	8,	1677698467,	'',	'f',	600,	900),
(1,	1,	'127.0.0.1/boca',	'Site A',	't',	't',	17100,	14400,	18000,	't',	'1',	'1',	'1',	3,	0,	0,	0,	0,	10,	1677698473,	'',	'f',	600,	900),
(2,	1,	'127.0.0.1/boca',	'Site D',	't',	't',	17100,	14400,	18000,	't',	'1',	'1',	'1',	3,	0,	0,	0,	0,	10,	1677698546,	'',	'f',	600,	900);

DELETE FROM "bkptable";

DELETE FROM "clartable";

DELETE FROM "answertable";
INSERT INTO "answertable" ("contestnumber", "answernumber", "runanswer", "yes", "fake", "updatetime") VALUES
(1,	0,	'Not answered yet',	'f',	't',	1677698473),
(1,	1,	'YES',	't',	'f',	1677698473),
(1,	2,	'NO - Compilation error',	'f',	'f',	1677698473),
(1,	3,	'NO - Runtime error',	'f',	'f',	1677698473),
(1,	4,	'NO - Time limit exceeded',	'f',	'f',	1677698473),
(1,	5,	'NO - Presentation error',	'f',	'f',	1677698473),
(1,	6,	'NO - Wrong answer',	'f',	'f',	1677698473),
(1,	7,	'NO - Contact staff',	'f',	'f',	1677698473),
(1,	8,	'NO - Name mismatch',	'f',	'f',	1677698473),
(2,	0,	'Not answered yet',	'f',	't',	1677698547),
(2,	1,	'YES',	't',	'f',	1677698547),
(2,	2,	'NO - Compilation error',	'f',	'f',	1677698547),
(2,	3,	'NO - Runtime error',	'f',	'f',	1677698547),
(2,	4,	'NO - Time limit exceeded',	'f',	'f',	1677698547),
(2,	5,	'NO - Presentation error',	'f',	'f',	1677698547),
(2,	6,	'NO - Wrong answer',	'f',	'f',	1677698547),
(2,	7,	'NO - Contact staff',	'f',	'f',	1677698547),
(2,	8,	'NO - Name mismatch',	'f',	'f',	1677698547);

DELETE FROM "problemtable";
INSERT INTO "problemtable" ("contestnumber", "problemnumber", "problemname", "problemfullname", "problembasefilename", "probleminputfilename", "probleminputfile", "probleminputfilehash", "fake", "problemcolorname", "problemcolor", "updatetime") VALUES
(2,	0,	'General',	'',	'',	NULL,	NULL,	NULL,	't',	'',	'',	1677698547),
(1,	0,	'General',	'',	'',	NULL,	NULL,	NULL,	't',	'',	'',	1677698473);

DELETE FROM "runtable";

DELETE FROM "sitetimetable";
INSERT INTO "sitetimetable" ("contestnumber", "sitenumber", "sitestartdate", "siteenddate", "updatetime") VALUES
(1,	2,	0,	0,	1678879693),
(1,	3,	0,	0,	1678879701),
(2,	5,	0,	0,	1678879720),
(2,	2,	0,	0,	1678879720),
(0,	1,	1,	0,	1677698466),
(1,	1,	1677699073,	0,	1677698473),
(2,	1,	1677699147,	0,	1677698546);

DELETE FROM "tasktable";

DELETE FROM "usertable";
INSERT INTO "usertable" ("contestnumber", "usersitenumber", "usernumber", "username", "userfullname", "userdesc", "usertype", "userenabled", "usermultilogin", "userpassword", "userip", "userlastlogin", "usersession", "usersessionextra", "userlastlogout", "userpermitip", "userinfo", "updatetime", "usericpcid") VALUES
(1,	1,	1001,	'judge1',	'',	'',	'team',	't',	'f',	'!7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	NULL,	NULL,	'',	'',	NULL,	'',	'',	1677698524,	''),
(1,	1,	1002,	'team1',	'',	'',	'team',	't',	'f',	'!7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	NULL,	NULL,	'',	'',	NULL,	'',	'',	1677698536,	''),
(2,	1,	1000,	'admin',	'Administrator',	NULL,	'admin',	't',	't',	'7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	'172.18.0.1',	1677698555,	'',	'',	1677698583,	NULL,	'',	1677698583,	''),
(2,	2,	1000,	'admin',	'Administrator',	NULL,	'admin',	't',	't',	'7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	NULL,	NULL,	'',	'',	NULL,	NULL,	'',	1678879720,	''),
(1,	2,	1000,	'admin',	'Administrator',	NULL,	'admin',	't',	't',	'7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	NULL,	NULL,	'',	'',	NULL,	NULL,	'',	1678879693,	''),
(1,	3,	1000,	'admin',	'Administrator',	NULL,	'admin',	't',	't',	'7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	NULL,	NULL,	'',	'',	NULL,	NULL,	'',	1678879701,	''),
(1,	1,	1000,	'admin',	'Administrator',	NULL,	'admin',	't',	't',	'7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	'172.18.0.1',	1678879873,	'',	'',	1678879884,	NULL,	'',	1678879884,	''),
(0,	1,	1,	'system',	'Systems',	NULL,	'system',	't',	't',	'7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	'172.18.0.1',	1678879887,	'',	'',	1678879894,	NULL,	'',	1678879894,	''),
(2,	5,	1000,	'admin',	'Administrator',	NULL,	'admin',	't',	't',	'7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	'172.18.0.1',	1678879898,	'ihqmru5r79m45i8e3spcsvdmon',	'ihqmru5r79m45i8e3spcsvdmon',	1678879805,	NULL,	'',	1678879898,	''),
(2,	5,	1003,	'team2',	'',	'',	'team',	't',	'f',	'!7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	NULL,	NULL,	'',	'',	NULL,	'',	'',	1678879930,	''),
(2,	5,	1002,	'judge2',	'',	'',	'judge',	't',	'f',	'!7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28',	NULL,	NULL,	'',	'',	NULL,	'',	'',	1678879957,	'');

-- 2023-03-01 19:24:12.142143+00