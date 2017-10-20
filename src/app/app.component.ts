import {Component, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import {ITreeOptions, TreeComponent, TreeNode} from 'angular-tree-component';
import {Observable} from "rxjs/Observable";
import * as faker from 'faker';
import {generateName} from "./redux/draft";

@Component({
  selector: 'app-root',
  template:
      `
    <tree-root #tree
               [nodes]="roots$ | async"
               [options]="options">
      <ng-template #treeNodeFullTemplate
                   let-node
                   let-index="index"
                   let-templates="templates">
        <div
          [class]="node.getClass()"
          [class.tree-node]="true"
          [class.tree-node-expanded]="node.isExpanded && node.hasChildren"
          [class.tree-node-collapsed]="node.isCollapsed && node.hasChildren"
          [class.tree-node-leaf]="node.isLeaf"
          [class.tree-node-active]="node.isActive"
          [class.tree-node-focused]="node.isFocused">

          <tree-node-wrapper [node]="node" [index]="index" [templates]="templates">
          </tree-node-wrapper>
          <button (click)="changeName(node.data.id)">Generate Name</button>

          <tree-node-children [node]="node" [templates]="templates">
          </tree-node-children>

        </div>
      </ng-template>
    </tree-root>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(TreeComponent)
  private tree: TreeComponent;
  $nodesFromStore;

  roots$: Observable<any[]>;
  options: ITreeOptions = {
    getChildren: (node: TreeNode) => {
      return this.$nodesFromStore
        .map(nodes => node.data.childIds.map(id => nodes[id]))
        .first()
        .toPromise();
    }
  };

  constructor(private store: Store<any>) {
  }

  ngOnInit(): void {
    this.roots$ = this.store.select('draft', 'roots');

    this.$nodesFromStore = this.store.select('draft', 'nodes')
      .do(console.log)
      .subscribe();


    /*this.store.select('draft', 'nodes')
      .do(() => this.tree.treeModel.update())
      .do(() => console.log(this.tree.treeModel))
      .subscribe();*/
  }

  changeName(id) {
    this.store.dispatch(generateName(faker.name.firstName(), id));
  }
}
