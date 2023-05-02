export class Correspondent {
  name:	string;
}

export class Message{
  from:	Correspondent;
  to: Correspondent;
  body:	string;
  date:	string;
}

export class Metadata {
  sentBy: User;
  anonymousSender:	boolean;
  read:	boolean;
  readDate:	string;
}

export class StoredMessage {
  id:	string;
  message:	Message;
  metadata:	Metadata;
}

export class TopicThread {
  id:	string;
  subject:	string;
  tags:	string[];
  from:	Correspondent;
  to:	Correspondent;
  messages:	StoredMessage[];
  created:	string;
  updated:	string;
}

export class User {
  name:	string;
  email:	string;
}
