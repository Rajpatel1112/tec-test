import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoListComponent } from './user-info-list.component';

describe('UserInfoListComponent', () => {
  let component: UserInfoListComponent;
  let fixture: ComponentFixture<UserInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
