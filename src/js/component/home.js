import React, { useState, useEffect } from "react";

//create your first component
export const Home = () => {
	const [list, setList] = useState([]);
	const [userInput, setUserInput] = useState("");

	useEffect(() => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/kedwards413")
			.then(function(response) {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				// Read the response as json.
				return response.json();
			})
			.then(function(responseAsJson) {
				setList(responseAsJson);
				setUserInput("");
			})
			.catch(function(error) {
				console.log("Looks like there was a problem: \n", error);
			});
	}, []);

	const deleteItem = index => {
		var updatedList = list.filter((task, taskIndex) => index != taskIndex);
		setList(updatedList);
		fetch("https://assets.breatheco.de/apis/fake/todos/user/kedwards413", {
			method: "PUT",
			body: JSON.stringify(updatedList),
			// label, done
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then(response => {
				console.log("Success:", response);
				fetch(
					"https://assets.breatheco.de/apis/fake/todos/user/kedwards413"
				)
					.then(function(response) {
						if (!response.ok) {
							throw Error(response.statusText);
						}
						return response.json(); // Read the response as json.
					})
					.then(function(responseAsJson) {
						setList(responseAsJson); // Set json into list
					})
					.catch(function(error) {
						console.log(
							"Looks like there was a problem: \n",
							error
						);
					});
			})
			.catch(error => console.error("Error:", error));
	};

	const handleKeyUp = () => {
		if (event.keyCode == 13 && userInput != "") {
			setList(list.concat(userInput));
			setUserInput("");
			fetch(
				"https://assets.breatheco.de/apis/fake/todos/user/kedwards413",
				{
					method: "PUT", // or 'POST'
					body: JSON.stringify(
						list.concat({ label: userInput, done: false })
					), // data can be `string` or {object}!
					headers: {
						"Content-Type": "application/json"
					}
				}
			)
				.then(response => {
					if (!response.ok) {
						throw Error(response.statusText);
					}
					return response.json();
				})
				.then(response =>
					console.log("Success:", JSON.stringify(response))
				)
				.catch(error => console.error("Error:", error));
		}
	};

	return (
		<div className="container">
			<div className="text-center">
				<h3>To Do List</h3>
				<div className="toDoList">
					<input
						className="todoInput"
						onChange={event => setUserInput(event.target.value)}
						value={userInput}
						onKeyUp={handleKeyUp} // triggers the handleKeyUp function above when user hits "enter"
					/>
					<ul className="list-group">
						{list.map((value, index) => {
							return (
								<ul>
									<li className="list-group-item" key={index}>
										<button
											type="button"
											className="btn btn-outline-primary"
											onClick={() => deleteItem(index)}>
											X
										</button>
										{value.label}
									</li>
								</ul>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};
