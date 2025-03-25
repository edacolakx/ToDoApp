import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  Alert,
  Button,
  Group,
  Modal,
  Textarea,
  TextInput,
  Checkbox,
} from "@mantine/core";

function App() {
  const [data, setData] = useState([]);
  const [today, setToday] = useState("");
  const [selected, setSelected] = useState(null);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});

  const [editmodal, setEditmodal] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/duties").then((res) => {
      console.log(res.data);
      setData(res.data);
      const initialCompletedTasks = res.data.reduce((acc, item) => {
        acc[item.id] = item.completed;
        return acc;
      }, {});
      setCompletedTasks(initialCompletedTasks);
    });
    const todays = new Date().toLocaleDateString();
    setToday(todays);
  }, []);

  async function addDuty(newData) {
    try {
      const response = await axios.post(
        "http://localhost:3000/dutyadd",
        newData
      );
      console.log("Sunucudan gelen yanıt:", response.data);
      if (response.data) {
        setData([...data, newData]);
        setTask("");
        setDescription("");
        setSelected(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteDuty = async (id) => {
    try {
      const response = await axios.delete("http://localhost:3000/dutydelete", {
        data: { id: id },
      });
      console.log("Veri silindi:", response.data);
      if (response.data) {
        // Veriyi silip UI'ı güncelle
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const toggleTaskCompletion = async (id) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setData(updatedData);

    try {
      await axios.put(`http://localhost:3000/update-completed`, {
        completed: !completedTasks[id],
      });
      setCompletedTasks((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <>
      <div className="flex bg-blue-800 w-full p-4">
        <p className="text-white">To Do</p>
      </div>
      <div className="p-4 ">
        <p className="font-bold text-2xl">Günüm</p>
        <p className="mb-8">{today}</p>
        <Button
          variant="filled"
          onClick={() => setSelected(!selected)}
          className="w-[100%] items-center justify-center p-4 px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.3)] transition-shadow"
        >
          + Görev Ekle
        </Button>
        {selected == true ? (
          <>
            <TextInput
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Görev Adı"
              styles={{
                input: {
                  width: "100%",
                  border: "none",
                  outline: "none",
                },
                root: {
                  border: "none",
                  outline: "none",
                },
              }}
              className="rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] w-full p-4 mt-4 focus:ring-0 border-0 bg-[#EFEFEF]"
            ></TextInput>

            <Textarea
              variant="filled"
              size="lg"
              radius="md"
              placeholder="Görev Açıklaması"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className=" mt-4 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] p-4 bg-[#EFEFEF]"
              styles={{
                input: {
                  width: "100%",
                  border: "none",
                  outline: "none",
                },
                root: {
                  border: "none",
                  outline: "none",
                },
              }}
            />
            <Button
              variant="light"
              className="w-[100%] bg-[#EFEFEF] items-center justify-center p-4 px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.3)] transition-shadow mt-4"
              onClick={() => {
                const newdata = {
                  id: data.length + 1,
                  duty: task,
                  description: description,
                };

                if (task == "") {
                  alert("Görev adı boş olamaz");
                } else {
                  addDuty(newdata);
                }
              }}
            >
              Ekle
            </Button>
          </>
        ) : (
          <></>
        )}
        <div className="mt-8">
          <p className="text-2xl font-bold">Görevlerim</p>
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 mt-4 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.3)] transition-shadow"
            >
              <div className="w-3/4">
                <div className="flex flex-row">
                  <Checkbox
                    checked={item.completed}
                    onChange={() => toggleTaskCompletion(item.id)}
                    className="mr-4"
                  />
                  <div>
                    <p className="font-semibold">{item.duty}</p>
                    <p className="text-xs">{item.description}</p>
                  </div>
                </div>
              </div>
              <div className="w-1/4 flex items-center justify-end">
                <Button
                  variant="light"
                  className="mr-6 bg-[#EFEFEF] items-center justify-center p-4 px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.3)] transition-shadow"
                  onClick={() => {
                    setEditmodal(true);
                  }}
                >
                  Düzenle
                </Button>
                <Button
                  variant="light"
                  className="bg-[#EFEFEF] items-center justify-center p-4 px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.3)] transition-shadow"
                  onClick={() => {
                    deleteDuty(item.id);
                  }}
                >
                  Sil
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        opened={editmodal}
        onClose={() => setEditmodal(false)}
        size="auto"
        title="Modal size auto"
        className="bg-[#EFEFEF] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <Group mt="xl">
          <Button>Add badge</Button>
          <Button>Remove badge</Button>
        </Group>
      </Modal>
    </>
  );
}

export default App;
