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
});
