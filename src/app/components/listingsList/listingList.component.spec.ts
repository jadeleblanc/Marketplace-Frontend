import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsListComponent } from './listingList.component';

describe('ListingsListComponent', () => {
  let component: ListingsListComponent;
  let fixture: ComponentFixture<ListingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
