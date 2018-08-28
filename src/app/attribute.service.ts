import { Attribute } from './attribute';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  private dbPath = '/attributes';

  userID: string;
  characterID: string;

  attributesRef: AngularFireList<Attribute> = null;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) { this.userID = user.uid; }
    });
  }

  setCharacterID(key: string) {
    if (key != null) {
      this.characterID = key;
    }
  }

  getCharacterID() {
    return this.characterID;
  }

  createAttribute(attribute: Attribute): void {
    this.attributesRef = this.db.list(`attributes/${this.userID}`);
    this.attributesRef.push(attribute);
  }

  updateAttribute(name: string, value: any): void {
    this.attributesRef.update(name, value).catch(error => this.handleError(error));
  }

  deleteAttribute(name: string): void {
    this.attributesRef.remove(name).catch(error => this.handleError(error));
  }

  getAttributesList(): AngularFireList<Attribute> {
    return this.attributesRef;
  }

  deleteAll(): void {
    this.attributesRef.remove().catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }

}

