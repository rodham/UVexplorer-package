import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockDisplayEdge1 } from 'mock_data/devices';
import { LinkDetailComponent } from './link-detail.component';
import { By } from '@angular/platform-browser';

describe('LinkDetailComponent', () => {
    let component: LinkDetailComponent;
    let fixture: ComponentFixture<LinkDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LinkDetailComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LinkDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should display loading before link details info is set', () => {
        const compDebug = fixture.debugElement;
        const loadingElem = compDebug.query(By.css('.loading'));

        expect(loadingElem).toBeTruthy();
    });

    it('should not display loading after link details info is set', () => {
        component.displayEdge = mockDisplayEdge1;
        fixture.detectChanges();
        const compDebug = fixture.debugElement;
        const loadingElem = compDebug.query(By.css('.loading'));

        expect(loadingElem).toBeNull();

        component.displayEdge = undefined;
    });

    it('should display no members message if there are no link members', () => {
        component.displayEdge = mockDisplayEdge1;
        component.numMembers = 0;
        fixture.detectChanges();

        const compDebug = fixture.debugElement;
        const noMembersElem = compDebug.query(By.css('#noDeviceLinkMembers'));

        expect(noMembersElem).toBeTruthy();
    });

    it('should display table if there are link members', () => {
        component.displayEdge = mockDisplayEdge1;
        component.numMembers = 1;
        fixture.detectChanges();

        const compDebug = fixture.debugElement;
        const tableElem = compDebug.query(By.css('.table-fixed'));

        expect(tableElem).toBeTruthy();
    });
});
