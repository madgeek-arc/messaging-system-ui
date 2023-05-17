import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export class Correspondent {
  name:	string;
  email:	string;
  groupId:	string;

  constructor() {
    this.name = null;
    this.email = null;
    this.groupId = null;
  }
}

export class Message {
  id: string;
  from:	Correspondent;
  to: [Correspondent];
  body:	string;
  date:	string;
  read: boolean;
  readDate: string;


  constructor() {
    this.id = null;
    this.from = new Correspondent();
    this.to = [new Correspondent()];
    this.body = null;
    this.date = null;
    this.read = null;
    this.readDate = null;
  }

  public static toFormGroup(fb: FormBuilder) {
    const message: FormGroup = fb.group(new Message())
    message.setControl('from', fb.group(new Correspondent()));
    message.setControl('to', fb.array([fb.group(new Correspondent())]));

    return message;
  }
}

export class TopicThread {
  id:	string;
  subject:	string;
  tags:	string[];
  from:	Correspondent;
  to:	[Correspondent];
  messages:	Message[];
  created:	string;
  updated:	string;

  constructor() {
    this.id = null;
    this.subject = null;
    this.tags = [];
    this.from = new Correspondent();
    this.to = [new Correspondent()];
    this.messages = [new Message()];
    this.messages[0].from = new Correspondent();
    this.messages[0].to = [new Correspondent()];
    this.created = null;
    this.updated = null;
  }

  public static toFormGroup(fb: FormBuilder) {
    const thread: FormGroup = fb.group(new TopicThread());
    thread.setControl('from', fb.group(new Correspondent()));
    thread.setControl('to', fb.array([fb.group(new Correspondent())]));
    thread.setControl('messages', fb.array([Message.toFormGroup(fb)]));

    return thread;

  }
}
