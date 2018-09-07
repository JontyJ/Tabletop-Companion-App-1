import { Attribute } from './attribute';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { CharacterService } from './character.service';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  private dbPath = '/attributes';

  userID: string;
  characterID: string;
  attributeID: string;

  attributesRef: AngularFireList<Attribute> = null;
  attributeRef: AngularFireObject<Attribute> = null;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private characterService: CharacterService) {
    this.afAuth.authState.subscribe(user => {
      if (user) { this.userID = user.uid; }
    });
  }

  setAttributeID(key: string) {
    if (key != null) {
      this.attributeID = key;
    }
  }

  getAttributeID() {
    return this.attributeID;
  }


  getAttributes(key: string): AngularFireList<Attribute> {
    // tslint:disable-next-line:curly
    if (!this.userID) return;
    this.attributesRef = this.db.list(`attributes/${this.userID}/${key}/`);
    return this.attributesRef;
  }

  getAttributesTracker() {
    this.characterID = this.characterService.getCharacterID();
    if (!this.userID) {
      return;
    } else {
      this.attributesRef = this.db.list(`attributes/${this.userID}/${this.characterID}`
      , ref => ref.orderByChild('tracked').equalTo(true));
      return this.attributesRef;
    }
  }

  createAttribute(attribute: Attribute): void {
    this.characterID = this.characterService.getCharacterID();
    this.attributesRef = this.db.list(`attributes/${this.userID}/${this.characterID}`);
    this.attributesRef.push(attribute);
  }

  // TODO: this.db.object is not a function?
  updateAttribute(attribute: Attribute): void {
    //this.attributeID = this.getAttributeID();
    this.attributeRef = this.db.object(`attributes/${this.userID}/${attribute.characterID}/${attribute.key}`);
    this.attributeRef.update(attribute).catch(error => this.handleError(error));
  }

  deleteAttribute(name: string): void {
    this.attributesRef.remove(name).catch(error => this.handleError(error));
  }

  deleteAll(): void {
    this.attributesRef.remove().catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }

}


