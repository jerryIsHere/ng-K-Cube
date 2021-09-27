import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiAgentService } from 'src/app/api-agent.service';
import { GraphEditorComponent } from 'src/app/page/graph-editor/graph-editor.component';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-triple-form',
  templateUrl: './triple-form.component.html',
  styleUrls: ['./triple-form.component.css']
})
export class TripleFormComponent implements OnInit {
  editor: GraphEditorComponent | undefined
  triple_id: number | undefined
  ids: [number | undefined, number | undefined, number | undefined,] = [undefined, undefined, undefined,]
  form: FormGroup | undefined
  filteredOptions: Observable<any[]> | undefined;
  constructor(public api: ApiAgentService, public dialogRef: MatDialogRef<TripleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.editor = data.editor
    if (data?.triple_id) {
      let search = this.editor?.triples?.filter(t => t.triple_id = data?.triple_id)
      if (search && search.length > 0) {
        this.triple_id = data?.triple_id
        let triple = search[0]
        this.ids = [triple.head_entity, triple.relationship, triple.tail_entity]
        let head = this.editor?.entities?.filter(e => e.entity_id == this.ids[0])[0].name
        let relationship = this.editor?.entities?.filter(e => e.entity_id == this.ids[1])[0].name
        let tail = this.editor?.entities?.filter(e => e.entity_id == this.ids[2])[0].name
        this.form = new FormGroup({
          head: new FormControl({ value: head, disabled: true }, Validators.required),
          relationship: new FormControl({ value: relationship, disabled: true }, Validators.required),
          tail: new FormControl({ value: tail, disabled: true }, Validators.required),
        })
      }
    }
    else if (data?.selected_entity_id) {
      this.ids = [data?.selected_entity_id, 1, undefined]
      let head = this.editor?.entities?.filter(e => e.entity_id == data?.selected_entity_id)[0].name
      this.form = new FormGroup({
        head: new FormControl({ value: head, disabled: true }, Validators.required),
        relationship: new FormControl({ value: 'relationship 1', disabled: true }, Validators.required),
        tail: new FormControl({ value: '', disabled: false }, Validators.required),
      })
      this.filteredOptions = this.form.valueChanges.pipe(
        startWith({ tail: '' }),
        map(value => this._filter(value))
      );

    }
  }
  private _filter(value: any): string[] {
    const filterValue = value.tail.toLowerCase();
    if (!this.editor || !this.editor.entities) return []
    return this.editor.entities.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  ngOnInit(): void {
  }
  submitForm() {
    if (this.form?.valid) {
      this.api.entities.search({ name: this.form.value.tail }).then(result => {
        if (result.length > 0) {
          this.api.triple.post({}, {
            graph_id: this.editor?.graph.graph_id,
            head_entity: this.ids[0], relationship: this.ids[1], tail_entity: result[0].entity_id
          }).then(result => {
            this.dialogRef.close(result)
          })
        }
        else {
          this.api.entity.post({}, { name: this.form?.value.tail }).then(new_tail => {
            this.api.triple.post({}, {
              graph_id: this.editor?.graph.graph_id,
              head_entity: this.ids[0], relationship: this.ids[1], tail_entity: new_tail.entity_id
            }).then(result => {
              this.dialogRef.close(result)
            })
          })
        }
      })
    }
  }
  delete() {
    if (this.triple_id) this.api.triple.delete(this.triple_id + '', {}).then(result => {
      this.dialogRef.close(result)
    })
  }
}
