import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { Button, Radio, Textarea, TextInput } from "@mantine/core";

function App() {
  const [data, setData] = useState([]);
  const [today, setToday] = useState("");
  const [selected, setSelected] = useState(null);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => {
      console.log(res.data);
      setData(res.data);
    });
    const todays = new Date().toLocaleDateString();
    setToday(todays);
  }, []);

  const [selectede, setSelectede] = useState(null);

  const handleChange = (e) => {
    setSelectede(e.target.value);
  };

  const handleUncheck = () => {
    setSelectede(null); // Radio butonunu uncheck yapar
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
              <input
                type="radio"
                value="1"
                checked={selectede === "1"}
                onChange={handleChange}
              />
              <div>
                <p>{item.task}</p>
                <p>{item.description}</p>
              </div>
              <div className="">
                <Button
                  variant="light"
                  className="mr-6 bg-[#EFEFEF] items-center justify-center p-4 px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.3)] transition-shadow"
                >
                  Düzenle
                </Button>
                <Button
                  variant="light"
                  className="bg-[#EFEFEF] items-center justify-center p-4 px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.3)] transition-shadow"
                >
                  Sil
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
