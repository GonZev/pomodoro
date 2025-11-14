export class taskModel {
  constructor(id, description, check = false) {
    this.id = id;
    this.description = description;
    this.check = check;
  }
}
