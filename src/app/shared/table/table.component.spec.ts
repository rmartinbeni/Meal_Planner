import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent<{ id: number; name: string }>;
  let fixture: ComponentFixture<TableComponent<{ id: number; name: string }>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableComponent],
    });

    fixture = TestBed.createComponent(TableComponent) as ComponentFixture<
      TableComponent<{ id: number; name: string }>
    >;
    component = fixture.componentInstance;

    fixture.componentRef.setInput('data', [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);
    fixture.componentRef.setInput('columns', ['id', 'name']);

    fixture.detectChanges();
  });

  it('should create and accept required inputs', () => {
    expect(component).toBeTruthy();
    expect(component.data().length).toBe(2);
    expect(component.columns().length).toBe(2);
  });

  it('should accept optional inputs with their default values', () => {
    expect(component.rows()).toBe(10);
    expect(component.showCaption()).toBe(true);
    expect(component.showCheckboxes()).toBe(true);
  });

  it('should emit addItem event when output is triggered', () => {
    let emitted = false;
    component.addItem.subscribe(() => {
      emitted = true;
    });

    component.addItem.emit();
    expect(emitted).toBe(true);
  });
});
