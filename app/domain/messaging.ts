export class Correspondent {
  name:	string;
  email:	string;
  groupId:	string;
}

export class Message {
  id: string;
  from:	Correspondent;
  to: Correspondent;
  body:	string;
  date:	string;
  read: boolean;
  readDate: string;
}

export class TopicThread {
  id:	string;
  subject:	string;
  tags:	string[];
  from:	Correspondent;
  to:	Correspondent;
  messages:	Message[];
  created:	string;
  updated:	string;
}
