import { MessageService } from './../message.service';
import { CharacterService } from './../character.service';

import { CharacterDetailsComponent } from './character-details.component';

import { AttributeService } from '../attribute.service';

import { Router } from '@angular/router';
import { Character } from '../character';

describe('CharacterDetailsComponent', () => {
  let testCharacterService: CharacterService;
  let testMessageService: MessageService;
  let testAttributeSerice: AttributeService;
  let testRouter: Router;
  let component: CharacterDetailsComponent;
  beforeEach(() => {
    testCharacterService = jasmine.createSpyObj('testCharacterService', [
      'deleteCharacter',
      'updateCharacter'
    ]);
    testMessageService = jasmine.createSpyObj('testMessageService', [
      'add'
    ]);
    testAttributeSerice = jasmine.createSpyObj('testAttributeService', [
      'setCharacterID'
    ]);
    testRouter = jasmine.createSpyObj('testRouter', [
      'navigateByUrl'
    ]);
    component = new CharacterDetailsComponent(
      testCharacterService,
      testMessageService,
      testAttributeSerice,
      testRouter
    );
  });
  afterEach(() => {
    testCharacterService = null;
    testMessageService = null;
    testAttributeSerice = null;
    testRouter = null;
    component = null;
  });
  describe('with valid character', () => {
    let testCharacter: Character;
    beforeEach(() => {
      testCharacter = <Character>{ key: 'Grog23'};
      component.character = testCharacter;
    });
    afterEach(() => {
      testCharacter = null;
    });
    it('createAttribute() should send character.key to attributeService.setCharacterID', () => {
      component.createAttribute();
      expect(testAttributeSerice.setCharacterID).toHaveBeenCalledWith(testCharacter.key);
    });
    it('createAttribute() should call router to navigate to addattribute', () => {
      component.createAttribute();
      expect(testRouter.navigateByUrl).toHaveBeenCalledWith('addattribute');
    });
    it('deleteCharacter() should call characterService.deleteCharacter with the character Key', () => {
      component.deleteCharacter();
      expect(testCharacterService.deleteCharacter).toHaveBeenCalledWith(testCharacter.key);
    });
    it('updateActive() should send the character key and { active: true/false } to characterService.updateCharacter()', () => {
      const isActive = true;
      component.updateActive(isActive);
      expect(testCharacterService.updateCharacter).toHaveBeenCalledWith(testCharacter.key, { active: isActive });
    });
  });
  it('addCharacter() should send "Add New Character" to messageService.add()', () => {
    const testMessage = 'Add New Character';
    component.addCharacter();
    expect(testMessageService.add).toHaveBeenCalledWith(testMessage);
  });
  it('reorderCharacters() should send "Reorder Character" to messageService.add()', () => {
    const testMessage = 'Reorder Character';
    component.reorderCharacters();
    expect(testMessageService.add).toHaveBeenCalledWith(testMessage);
  });
});
