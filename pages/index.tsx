import { initializeApp } from '@firebase/app';
import { getDatabase, ref, push, onChildChanged, onValue, set, remove } from 'firebase/database';
import Link from 'next/link';
import React, { CSSProperties, useEffect, useState } from 'react'
import { ChromePicker } from 'react-color';

const firebaseConfig = {
	apiKey: "AIzaSyBMZGy-qwfwCqv_q87y-pasdsYTguOEw2s",
	authDomain: "website-powerdraw-lab.firebaseapp.com",
	databaseURL: "https://website-powerdraw-lab-default-rtdb.firebaseio.com",
	projectId: "website-powerdraw-lab",
	storageBucket: "website-powerdraw-lab.appspot.com",
	messagingSenderId: "1036046404454",
	appId: "1:1036046404454:web:be0d1e7d8bde6f810896a7"
};

initializeApp(firebaseConfig);

class Home extends React.Component<any, any> {

	state = {
		bg: { hex: '#fff', hsl: {} },
		menuIsVisible: true,
		powerDraw: [],
		input: '',
		editMode: false,
	}

	componentDidMount() {
		const db = getDatabase();
		const r = ref(db, 'bg')
		onValue(r, (data) => {
			console.log(data.val())
			this.setState({ bg: { hex: data.val().hex, hsl: data.val().hsl } })
		})
		const p = ref(db, 'powerdraw')
		onValue(p, (data) => {
			let out = Object.keys(data.val());
			out = out.map(key => {
				return { key, ...data.val()[key] }
			})
			this.setState({ powerDraw: out })
		})
	}

	handleChangeComplete = (color) => {
		const db = getDatabase();
		const r = ref(db, 'bg')
		console.log(color);
		set(r, { hex: color.hex, hsl: color.hsl });
	};

	submit = () => {
		if (this.state.input == '') {
			alert("error: no powerdraw was given")
			return;
		}

		const db = getDatabase();
		const p = ref(db, 'powerdraw')
		push(p, { powerdraw: this.state.input, hex: this.state.bg.hex, hsl: this.state.bg.hsl })
		this.setState({ input: '' })
	}

	onClickEditMode = () => {
		this.setState({ editMode: !this.state.editMode })
	}

	deleteItem = (x: any) => {
		console.log(x.key);
		const db = getDatabase();
		const p = ref(db, 'powerdraw/' + x.key)
		remove(p);
	}

	render() {
		return (
			<>
				<div style={{ height: `100vh`, width: `100vw`, position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: this.state.bg.hex }}>
					<div style={{
						cursor: 'pointer',
						position: 'absolute', top: 20, right: 20,
						height: 80, width: 80, paddingTop: 20, paddingBottom: 20, backgroundColor: 'black', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
					}}
						onClick={() => this.setState({ menuIsVisible: true })}

					>
						<div style={{ width: 47, height: 5, backgroundColor: 'yellow', margin: 3 }} />
						<div style={{ width: 47, height: 5, backgroundColor: 'yellow', margin: 3 }} />
						<div style={{ width: 47, height: 5, backgroundColor: 'yellow', margin: 3 }} />
					</div>


				</div >

				{this.state.menuIsVisible &&

					<div style={{ color: '#ddd', paddingLeft: 20, width: '100vw', maxWidth: 350, backgroundColor: '#222', position: 'absolute', right: 0, top: 0, minHeight: '100vh', paddingBottom: 100 }}>
						<div style={{
							cursor: 'pointer',
							position: 'absolute', top: 20, right: 20,
							height: 80, width: 80, paddingTop: 20, paddingBottom: 20, backgroundColor: 'black', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
						}}
							onClick={() => this.setState({ menuIsVisible: false })}
						>
							<h1 style={{ marginTop: 12, color: 'yellow' }}>x</h1>
						</div>

						<h1 style={{ marginTop: 120, }} >bg color: ({hslString(this.state.bg.hsl)})</h1>
						<ChromePicker style={{ width: `100%` }} color={this.state.bg.hex} onChangeComplete={this.handleChangeComplete} />
						<p>add power draw for above color:</p>
						<input placeholder='-- power draw --' value={this.state.input} onChange={e => this.setState({ input: e.target.value })} style={{ width: `90%`, height: 55, paddingLeft: 10, fontSize: 18 }}></input>
						<button onClick={this.submit} style={{ marginTop: 20, height: 55, width: 200 }}>submit</button>
						<p>---</p>

						<p>power draw stats: <span onClick={this.onClickEditMode} style={{ cursor: 'pointer', color: 'red', textDecoration: 'underline' }}>  Edit Mode?</span></p>
						{this.state.powerDraw.map(x => {
							return <>
								{this.state.editMode &&
									<button onClick={() => this.deleteItem(x)} style={{ backgroundColor: 'red', marginTop: 30 }}>DELETE</button>
								}
								<div style={{ padding: 20, display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10, backgroundColor: x.hex }}>
									<div style={{ display: 'flex', flexDirection: 'column', margin: 0, padding: 0, marginRight: 40 }}>
										<p style={{ margin: 0, padding: 0 }}>Power</p>
										<p style={{ margin: 0, padding: 0 }}>{x.powerdraw}</p>
									</div>

									<div style={{ display: 'flex', flexDirection: 'column', margin: 0, padding: 0, marginRight: 40 }}>
										<p style={{ margin: 0, padding: 0 }}>color-hsl</p>
										<p style={{ margin: 0, padding: 0 }}>{hslString(x.hsl)}</p>
									</div>

									<div style={{ display: 'flex', flexDirection: 'column', margin: 0, padding: 0, marginRight: 40 }}>
										<p style={{ margin: 0, padding: 0 }}>hex</p>
										<p style={{ margin: 0, padding: 0 }}>{x.hex}</p>
									</div>
								</div>
							</>
						})}
					</div>
				}
			</>
		)
	}
}

function hslString(hsl: any) {
	return `H:${hsl.h},S:${Math.floor(100 * hsl.s)},L:${Math.floor(100 * hsl.l)}`
}

export default Home

