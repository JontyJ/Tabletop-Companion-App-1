import { AttributeService } from './attribute.service';
import { CharacterService } from './character.service';

import { AngularFireList, AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';

import { Character } from './character';

import * as firebase from 'firebase';

describe('CharacterService', () => {
  let testThenableReference: firebase.database.ThenableReference;
  let testAngularFireList: AngularFireList<Character>;
  let testCharacterID: string;
  let testDb: AngularFireDatabase;
  let testUserId: string;
  let testCharacter: Character;
  let testAuthState: Observable<firebase.User>;

  let service: CharacterService;

  beforeEach(() => {
    testThenableReference = jasmine.createSpyObj('testThenableReference', [
      'then'
    ]);
    testAngularFireList = jasmine.createSpyObj('testAngularFireList', [
      'push',
      'update',
      'remove'
    ]);
    (<jasmine.Spy>(testAngularFireList.push)).and.returnValue(testThenableReference);
    (<jasmine.Spy>(testAngularFireList.update)).and.returnValue({catch(): void {}});
    (<jasmine.Spy>(testAngularFireList.remove)).and.returnValue({catch(): void {}});

    testCharacterID = '23';

    testDb = jasmine.createSpyObj('testDb', [
      'list',
      'object'
    ]);
    (<jasmine.Spy>(testDb.list)).and.returnValue(testAngularFireList);
    (<jasmine.Spy>(testDb.object)).and.returnValue(testAngularFireList);

    testUserId = 'Dave55';
    testCharacter = {
      key: testCharacterID,
      name: 'Grog',
      userID: testUserId,
      tracked: false
    };

    // spyOn(firebase, 'auth').and.returnValue( { currentUser: { uid: testUserId } } );

    spyOn(firebase, 'auth').and.returnValue( of(testUserId) );

    testAuthState = new Observable((observer) => {
      return {unsubscribe() { const user = {uid: testUserId }; }};
    });

    // TODO: cannot read snapshot of null should pass when a user id is propperly supplied in constructor observable
    service = new CharacterService(testDb, <AngularFireAuth>{ authState: testAuthState});
  });
  afterEach(() => {
    testThenableReference = null;
    testAngularFireList = null;
    testDb = null;
    testUserId = null;
    testCharacter = null;
    testAuthState = null;
    service = null;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // TODO: failed test here, expect it to be due to not properly passing test userid in constructor observable
  // it('should get userID from AngularFireAuth', () => {
  //   expect(service.userID).toBe( testUserId );
  // });

  // TODO: test handleError somehow?

  describe('with valid userID', () => {
    beforeEach(() => {
      service.userID = testUserId;
    });
    afterEach(() => {
      service.userID = null;
    });

    it('getCharacterList() should set charactersRef to list from db', () => {
      service.getCharactersList();
      expect(service.charactersRef).toBe(testAngularFireList);
    });

    it('getCharacterList() should return the list from db list', () => {
      service.getCharactersList();
      expect(service.charactersRef).toBe(testAngularFireList);
    });

    describe('with charactersRef assigned to db list', () => {
      beforeEach(() => {
        service.charactersRef = testAngularFireList;
      });

      it('createCharacter() should push character to db list', () => {
        service.createCharacter(testCharacter);
        expect(testAngularFireList.push).toHaveBeenCalledWith(testCharacter);
      });

      // TODO: Test this somehow
      // it('createCharacter() should set characterID to ref.key', () => {
      // });

      it('updateCharacter() should update db list', () => {
        service.updateCharacter(testCharacter);
        expect(testAngularFireList.update).toHaveBeenCalledWith(testCharacter);
      });

      it('deleteAttribute() should remove it from db list', () => {
        service.deleteCharacter(testCharacter.key);
        expect(testAngularFireList.remove).toHaveBeenCalledWith(testCharacter.key);
      });

      it('deleteAll() should call remove on db list', () => {
        service.deleteAll();
        expect(testAngularFireList.remove).toHaveBeenCalledWith();
      });
    });
  });

  describe('without valid userID', () => {
    beforeEach(() => {
      service.userID = null;
    });
    it('getCharacterList should do nothing', () => {
      expect(service.getCharactersList()).toBeUndefined();
    });
  });
});
