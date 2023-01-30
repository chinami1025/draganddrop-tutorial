import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import dummyData from "../dummyDate";
import Card from "./Card";

const Main = () => {
  const [date, setDate] = useState(dummyData);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    //別のカラムにタスクが移動したとき
    if (source.droppableId !== destination.draggableId) {
      const sourceColIndex = date.findIndex((e) => e.id === source.droppableId);
      const destinationColIndex = date.findIndex(
        (e) => e.id === destination.droppableId
      );
      const sourceCol = date[sourceColIndex];
      const destinationCol = date[destinationColIndex];

      const sourceTask = [...sourceCol.tasks];
      const destinationTask = [...destinationCol.tasks];

      //動かし始めたタスクを削除
      const [removed] = sourceTask.splice(source.index, 1);

      //動かした後のカラムにタスクを追加
      destinationTask.splice(destination.index, 0, removed);

      date[sourceColIndex].tasks = sourceTask;
      date[destinationColIndex].tasks = destinationTask;
      setDate(date);
    } else {
      //同じカラム内でのタスクの入れ替え
      const sourceColIndex = date.findIndex((e) => e.id === source.droppableId);
      console.log(sourceColIndex);
      const sourceCol = date[sourceColIndex];
      console.log(sourceCol);

      const sourceTask = [...sourceCol.tasks];
      //タスクを削除
      const [removed] = sourceTask.splice(source.index, 1);
      //タスクを追加
      sourceTask.splice(destination.index, 0, removed);

      date[sourceColIndex].tasks = sourceTask;
      setDate(date);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="trello">
        {date.map((section) => (
          <Droppable key={section.id} droppableId={section.id}>
            {(provided) => (
              <div
                className="trello-section"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="trello-section-title">{section.title}</div>
                <div className="trello-section-content">
                  {section.tasks.map((task, index) => (
                    <Draggable
                      draggableId={task.id}
                      index={index}
                      key={task.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? "0.3" : "1",
                          }}
                        >
                          <Card>{task.title}</Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Main;
