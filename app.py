from flask import Flask, render_template, request, redirect, session
from datetime import datetime

app = Flask(__name__)
app.secret_key = "secret123"

# Fake users
EMPLOYEES = {
    "alice": "password1",
    "bob": "password2",
    "carla": "password3",
}

# In-memory message list
MESSAGES = []

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form.get("username").lower()
        pwd = request.form.get("password")
        if user in EMPLOYEES and EMPLOYEES[user] == pwd:
            session["user"] = user
            return redirect("/chat")
        return render_template("login.html", error=True)
    return render_template("login.html")

@app.route("/chat", methods=["GET", "POST"])
def chat():
    if "user" not in session:
        return redirect("/")
    if request.method == "POST":
        text = request.form.get("message")
        if text:
            MESSAGES.append({
                "sender": session["user"],
                "text": text,
                "time": datetime.now().strftime("%H:%M:%S")
            })
    return render_template("chat.html", user=session["user"], messages=MESSAGES)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)
