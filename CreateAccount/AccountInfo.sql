CREATE TABLE [dbo].[AccountInformation]
(
  [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  FirstName [NVARCHAR] (50) NOT NULL,
  LastName [NVARCHAR] (50) NOT NULL,
  Birthday [DATE] NOT NULL,
  Username [NVARCHAR] (50) NOT NULL,
  Email [NVARCHAR] (50) NOT NULL,
)
