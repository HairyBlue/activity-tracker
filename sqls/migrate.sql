create TABLE if not EXISTS SchoolYear(
	school_year_uuid varchar(255) unique not null,
	yearStart varchar(255) unique not null,
    yearEnd varchar(255) unique not null
);

create table if not exists Category(
	categoryId int primary key auto_increment,
    category_uuid varchar(255) not null,
    categoryName varchar(255) not null,
    categoryArchive boolean default false,
    category_created_at timestamp default current_timestamp,
    category_updated_at timestamp default current_timestamp on update current_timestamp
);

create table if not exists Club(
	clubId int primary key auto_increment,
    club_uuid varchar(255) not null,
    clubAcronym varchar(191),
    clubName varchar(255) not null,
    clubArchive boolean default false,
    club_created_at timestamp default current_timestamp,
    club_updated_at timestamp default current_timestamp on update current_timestamp
);

create table if not exists TargetActivity(
	targetActivityId int primary key auto_increment,
    targetActivityNumber int not null,
    targetActivityYear varchar(15) not null,
    targetActivitySemester ENUM('1', '2') DEFAULT '1',
    club_id int not null
);

create table if not exists Activity(
	activityId int primary key auto_increment,
    activity_uuid varchar(255) not null,
    activityName varchar(255) not null,
    activityNotes LONGTEXT null,
    category_id int not null,
    club_id int not null,
    activityDisplayDate varchar(62) not null,
    activityStartDateIso varchar(62) not null,
    activityEndDateIso varchar(62) not null,
    activitySemester ENUM('1', '2') DEFAULT '1',
    activitySchoolYear varchar(62) not null,
    activityVenue varchar(255) null,
    activityModality enum("FACE TO FACE", "ONLINE", "HYBRID"),
    activityStatus boolean default false,
    activityComments text null,
    activityStatusTimeStamp varchar(255) null,
    activityArchive boolean default false,
    activity_created_at timestamp default current_timestamp,
    activity_updated_at timestamp default current_timestamp on update current_timestamp
);

create table if not exists Levels (
	levelId int auto_increment PRIMARY KEY,
    level enum("WEBMASTER", "ADMIN", "STAFF", "STUDENT")
);
insert into Levels (level) values("WEBMASTER"), ("ADMIN"),("STAFF"), ("STUDENT");

create table if not exists Users (
	userId int auto_increment PRIMARY KEY,
    user_uuid varchar(255) not null unique,
    username VARCHAR(191) not null UNIQUE,
	email VARCHAR(191) not null UNIQUE,
	password VARCHAR(191) not null,
	login BOOLEAN DEFAULT False
);
create table if not exists Roles(
	roleId int auto_increment PRIMARY KEY,
	user_id int not null,
	level_id int not null
);

create table if not exists Student(
	studentId int auto_increment PRIMARY KEY,
    student_user_id int not null,
    club_id int not null,
    schoolYear varchar(62) not null,
    student_uuid varchar(255) not null unique
);

create table if not exists Documents(
	documentId int auto_increment PRIMARY KEY,
    document_activity_id int not null,
	documentInfo longtext null,
    documentLocation text null
);
create table if not exists Images(
	imageId int auto_increment PRIMARY KEY,
	imageLocation text null,
	image_document_id int not null
);
create table if not exists Pdf(
	pdfId int auto_increment PRIMARY KEY,
	pdfLocation text null,
	pdf_document_id int not null
);
create table if not exists Video(
	videoId int auto_increment PRIMARY KEY,
	videoLocation text null,
	video_document_id int not null
);

INSERT INTO Category (category_uuid, categoryName) VALUES
('a73652f5-2e4b-4807-b2b8-713a9877a339', 'ORGANIZATIONAL MANAGEMENT DEVELOPMENT'),
('14eee219-76cd-4ab1-ac90-af486f998575', 'SPIRITUAL RELIGIOUS FORMATION'),
('f90f916c-da61-4558-a310-ce1fb8600553', 'KNOWLEDGE AND SKILLS DEVELOPMENT'),
('42922e28-ef51-4497-b230-2fcd1e680e37', 'COMMUNITY ENGAGEMENT AND SOCIAL ADVOCACY'),
('22e082b0-60fa-4471-b0bb-b3da6494bb89', 'CAPACITY AND TEAM BUILDING'),
('568b186a-4afb-47ad-81bc-46ba6418b26c', 'RESEARCH AND PROJECT INITIATIVES');

INSERT INTO Club (club_uuid, clubAcronym, clubName) VALUES
('e7c3a5a6-b0fc-4dd3-ba7d-8cfe407944c4', 'ACSS', 'Association of Computer Studies Students'),
('2dc0d7ad-e30d-46b6-80cd-16233d0042e0', 'ALAS', 'Association of Liberal Arts Students'),
('070ac464-a3ec-463d-b5e9-cb7f2133deca', 'AMMS', 'Association of Marketing Management Students'),
('b3f07d27-4874-46e0-afa2-323abc799239', 'ASA', 'Association of Student Assistants'),
('0a488a53-d3eb-479c-8d40-ca7f8b94610a', 'CABE', 'College of Accountancy, Business and Entrepreneurship'),
('66ee6e2b-6bd4-4606-8c74-08edc84ceef2', 'CCIS', 'College of Computing and Information Sciences'),
('d4ea91b8-d727-49bc-ab4f-12de56a1f4c7', 'CEDAS', 'College of Education, Arts and Sciences'),
('fa4c2904-e830-435a-a762-dd6556776a45', 'CHS', 'College of Health Sciences'),
('20226532-99e5-4243-a3ca-eb69ed8fae0e', 'CSP', 'College of Special Programs'),
('1a5ef5a4-b18d-438c-86df-4ccd21f96360', 'CSPSG', 'College of Special Programs Student Government'),
('f4e457a7-0d0e-4c4c-8c29-818c99b9d161', 'CSG', 'College Student Government'),
('a2a83513-9368-4356-95f0-2e357f185589', 'CBC', 'Crime Buster Club'),
('4c2632f3-0c3d-4c2b-aa44-a0a550f0ff3f', '', 'Innovators'),
('b36cd58e-5fa7-4e6e-ac2b-8830c2ed0423', 'JAHM', 'Junior Association of Hospitality Management'),
('7e14ade4-2b69-4a64-af41-9527973df701', 'JEBA', 'Junior Executives of Business Administration'),
('5e201391-fe16-4d5c-9443-fcbbe92466f0', 'JFINEX-Regular College', 'Junior Financial Executives'),
('09a76c6d-9210-406e-8140-b7a474430854', 'JFINEX-CSP', 'Junior Financial Executives'),
('cb9aad15-8f12-4838-9de6-6cc9221f9682', 'JPAMA', 'Junior Philippine Association of Management Accountants'),
('e1af163e-a536-4bd7-88dd-9cae8e9e12ba', 'JPICE', 'Junior Philippine Institute of Civil Engineers'),
('93dda0cc-7384-4fe7-9c94-052ca2ca3a42', 'JPIA', 'Junior Philippine Institute of Accountants'),
('13a0a294-e83c-4c2a-9dba-45aaec651737', 'JPMAP-Regular College', 'Junior People Management Association of the Philippines'),
('4bf9a359-890e-4260-b370-9414e3a1c769', 'JPMAP-CSP', 'Junior People Management Association of the Philippines'),
('76636ca6-3460-43a6-92f5-dbfbbe6bb868', 'KAMAFIL-Regular College', 'Kapisanan ng mga Mag-aaral sa Filipino'),
('2fd5b2b8-15b5-4378-8b90-610835aac67a', 'KAMAFIL-Socialize', 'Kapisanan ng mga Mag-aaral sa Filipino'),
('a7811a95-5ebc-4eb5-8b16-e211a23bbac1', 'LESCIEM', 'League of Science Majors'),
('80ee6d12-cd3b-4dce-b29e-423c4d8dcd8c', '', 'Math Club'),
('23aac37e-9714-4e8e-a802-51deda8f565a', 'OPEM-Regular', 'Organization of Physical Education Major'),
('dfe4a7b9-ba19-4b02-b25a-a79ea0deba33', 'OPEM-Socialize', 'Organization of Physical Education Major'),
('93cce6e8-a333-4ad9-85c2-474b5eaf0407', 'PFC', 'Peer Facilitators’ Club'),
('f4fe14c8-eeca-4e11-9f8a-4273f7d2c0da', 'PNSA', 'Philippine Nursing Student Association'),
('5fab19cd-9f81-40fb-b2c5-fd1ba0e8e367', 'RCY', 'Red Cross Youth'),
('7c5d94bb-23c4-4288-8cc4-6bd69a76c2a1', 'START', 'Student Association of Radiologic Technology'),
('da4cf0bb-6f91-4b49-8ee3-474276b64876', 'SEEDS', 'Society of Elementary Education Students'),
('0409f66f-a292-4bcb-86c9-2a49e5b173ab', 'SEM-Regular College', 'Society of English Majors'),
('72c18d2f-553c-4e05-9706-349010cc9ec4', 'SEM-CSP', 'Society of English Majors'),
('6dfcee0e-c27e-44a4-92d2-dcac570459b9', 'SJP', 'Society of Junior Psychologists'),
('8f37af9b-ef0b-4f59-965e-45be882ee97e', 'SOMAMA', 'Society of Math Majors'),
('0cee04b3-b7ef-452d-9e51-21dace7da672', '', 'TerpsiCORean Performing Group'),
('63de4fe2-b8e9-430b-acef-2e31f2c8ee2a', '', 'Vocation Club/Hummingbirds/Lectors'),
('2ee2066a-63ea-46f8-9d38-fea12e732d76', 'YIS', 'Young Information Specialist'),
('bb6b5eb5-7067-41da-a40e-3285ada90112', 'YFC', 'Youth for Christ');


INSERT INTO SchoolYear VALUES
('ccc6d7ab-57aa-4e10-984e-f47f2e25787b', '2000', '2001'),
('95b3279f-b71c-44fa-9cc5-8d1e9b9700e5', '2001', '2002'),
('0952deea-934d-42cc-a44d-9f57b791c36c', '2002', '2003'),
('4a99144d-ceb5-494a-8b5f-aa9684bda62a', '2003', '2004'),
('4cfa5e28-c5a3-4a4f-9cca-e9a0125b680e', '2004', '2005'),
('dab2e6e9-1ad2-435b-952f-b4d38470aa6a', '2005', '2006'),
('387584ad-10d4-4330-b13f-816f9bb5671a', '2006', '2007'),
('dfa2a91d-2099-4858-974f-04df342d3578', '2007', '2008'),
('c15f49f9-059e-47ad-a2e0-aed3f7ea47f7', '2008', '2009'),
('59a7f191-80ca-4589-bca5-8d7cf7ccb640', '2009', '2010'),
('c5fc6901-90ef-4639-8f58-858c066ee43e', '2010', '2011'),
('368cb3f0-2f6a-4a6b-bc66-69513b70fc70', '2011', '2012'),
('adcac774-6252-4640-9960-de8b47a9fa0f', '2012', '2013'),
('a18b7116-9c0a-4e52-aa1c-4faf91bcf3d4', '2013', '2014'),
('fd85af2f-fa71-4786-b1a2-a66d5382cd81', '2014', '2015'),
('c0f0d702-d379-4cea-b6fc-780c33b554ba', '2015', '2016'),
('aa0ec2b7-e200-4a3b-96e9-5715fe6a1dd2', '2016', '2017'),
('5628723b-7c00-44b0-aeb6-713d35c50845', '2017', '2018'),
('8340c943-8388-42f2-8890-b1d8fbe72f89', '2018', '2019'),
('437fe923-065b-4bac-9d56-32628a930e83', '2019', '2020'),
('dced9cdb-0811-4478-948c-c31ab1ec45c2', '2020', '2021'),
('e051d325-8ba8-472a-b32b-20259f0f47ef', '2021', '2022'),
('635d532e-02fe-49aa-94d8-f014d875cce8', '2022', '2023'),
('a41d3a83-5711-4550-b6bd-70cd20b8ffb2', '2023', '2024'),
('71e1248c-29a0-4e4b-822e-931cfbf71ee6', '2024', '2025'),
('988f3e2b-e4b5-4be1-afb3-ce597939e2be', '2025', '2026'),
('9ecda526-5d46-43c3-b153-5b08ff5c65ee', '2026', '2027'),
('75357d37-04a1-4288-9a18-7a9301f329c1', '2027', '2028'),
('5f4caf23-962e-4ab8-b67c-1b29643c12b3', '2028', '2029'),
('4a30acf0-488f-4a62-b436-8630dc2c2c2c', '2029', '2030'),
('da5e7a0b-3099-4dcf-a083-19309e41488a', '2030', '2031'),
('9b859b59-79ef-48f4-943e-262a0b56b552', '2031', '2032'),
('52672cbe-33ed-4c68-a13b-d9746b4bb30f', '2032', '2033'),
('f14da9e9-3aa1-41a4-9004-3e6c7e518fee', '2033', '2034'),
('8b296ea9-98e5-4cd2-9075-2a48b94df750', '2034', '2035'),
('f07fb59b-b48c-49f0-b015-222cc622e8a2', '2036', '2037'),
('8a7708d6-9d61-453e-8ed0-53de6cffc041', '2037', '2038'),
('1b9b5357-52a0-4ef4-8fd8-e5a1e830f331', '2038', '2039'),
('dcbc49c2-3a42-402a-8717-8ce6725128cd', '2039', '2040'),
('af2b79df-edcf-4073-ad2f-287de7404417', '2041', '2042'),
('078baabf-df23-41c9-af41-a50dd0595c91', '2042', '2043'),
('a5abd820-47ab-4860-9b6a-452ae3d7c5ac', '2043', '2044'),
('f8f7f50f-bb91-4c24-b9af-769a26474258', '2044', '2045'),
('c997fd66-9b50-4a7e-85f0-5811a0a0d919', '2045', '2046'),
('86cc655b-79fc-49f4-8fc8-240cbb55bb48', '2046', '2047'),
('49471b9e-66b5-4cd0-9f03-2c65e4a24e5f', '2047', '2048'),
('8e44cdff-3a36-4400-baa9-53c821152f8b', '2048', '2049'),
('c1b9f2b1-c9a0-4864-9985-4b1dd377bbb8', '2049', '2050');

-- ALTER TABLE Roles 
ALTER TABLE Roles ADD CONSTRAINT `Roles_user_id_fkey` FOREIGN KEY (user_id) REFERENCES Users (userId) on DELETE CASCADE on UPDATE CASCADE;
ALTER TABLE Roles ADD CONSTRAINT `Roles_position_id_fkey`  FOREIGN KEY (level_id) REFERENCES Levels (levelId) on DELETE CASCADE on UPDATE CASCADE;

-- ALTER TABLE STUDENT
ALTER TABLE Student ADD CONSTRAINT `Student_user_id_fkey` FOREIGN KEY (student_user_id) REFERENCES Users (userId) on DELETE CASCADE on UPDATE CASCADE;
ALTER TABLE Student ADD CONSTRAINT `Student_club_id_fkey` FOREIGN KEY (club_id) REFERENCES Club (clubId) on DELETE CASCADE on UPDATE CASCADE;

-- ADD WEBMASTER
insert into Users(user_uuid, username, email, password) values("3ddb0697-bcf3-4457-a3cd-2878f7ee53e5", "Webmaster", "Webmaster@sample.com", "$2a$12$JrvdCC5AdH2IppkM/SDn7er5/1/hiRkFJ5u1FJJhJ/iHsFDQ8dRGm");
insert into Roles(user_id , level_id) values (1, 1);

ALTER TABLE TargetActivity ADD CONSTRAINT `TargetActivity_club_id_fkey` FOREIGN KEY (club_id) REFERENCES Club (clubId) on DELETE CASCADE on UPDATE CASCADE;
ALTER TABLE Activity ADD CONSTRAINT `Activity_club_id_fkey` FOREIGN KEY (club_id) REFERENCES Club (clubId) on DELETE RESTRICT on UPDATE CASCADE;
ALTER TABLE Activity ADD CONSTRAINT `Activity_category_id_fkey` FOREIGN KEY (category_id) REFERENCES Category (categoryId) on DELETE RESTRICT on UPDATE CASCADE;

ALTER TABLE Documents ADD CONSTRAINT `Document_activity_id_fkey` FOREIGN KEY (document_activity_id) REFERENCES Activity (activityId) on DELETE RESTRICT on UPDATE CASCADE;
ALTER TABLE Images ADD CONSTRAINT `Images_document_id _fkey` FOREIGN KEY (image_document_id) REFERENCES Documents (documentId) on DELETE CASCADE on UPDATE CASCADE;
ALTER TABLE Video ADD CONSTRAINT `Video_document_id _fkey` FOREIGN KEY (video_document_id) REFERENCES Documents (documentId) on DELETE CASCADE on UPDATE CASCADE;
ALTER TABLE Pdf ADD CONSTRAINT `Pdf_document_id _fkey` FOREIGN KEY (pdf_document_id) REFERENCES Documents (documentId) on DELETE CASCADE on UPDATE CASCADE