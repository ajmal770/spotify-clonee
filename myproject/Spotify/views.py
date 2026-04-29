from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from .models import SignupUser
import re


# ---------------------------
# LOGIN PAGE
# ---------------------------
def login_view(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = SignupUser.objects.get(email=email)
            if check_password(password, user.password):
                request.session['user_id'] = user.id
                request.session['user_email'] = user.email
                return redirect('home')
            else:
                return render(request, 'login.html', {'error': 'Invalid password'})
        except SignupUser.DoesNotExist:
            return render(request, 'login.html', {'error': 'User not found'})

    return render(request, 'login.html')


# ---------------------------
# STEP 1: EMAIL
# ---------------------------
def signup_view(request):
    if request.method == "POST":
        email = request.POST.get('email')

        if SignupUser.objects.filter(email=email).exists():
            return render(request, 'signup.html', {'error': 'Email already exists'})

        request.session['email'] = email
        return redirect('signup2')

    return render(request, 'signup.html')


# ---------------------------
# STEP 2: PASSWORD
# ---------------------------
def signup2_view(request):
    if request.method == "POST":
        password = request.POST.get('password')

        if not validate_password(password):
            return render(request, 'signup2.html', {'error': 'Weak password'})

        request.session['password'] = password
        return redirect('signup3')

    return render(request, 'signup2.html')


# ---------------------------
# STEP 3: PERSONAL INFO
# ---------------------------
def signup3_view(request):
    if request.method == "POST":
        name = request.POST.get('name')
        year = request.POST.get('year')
        month = request.POST.get('month')
        day = request.POST.get('day')
        gender = request.POST.get('gender')

        months = {
            'January': '01', 'February': '02', 'March': '03',
            'April': '04', 'May': '05', 'June': '06',
            'July': '07', 'August': '08', 'September': '09',
            'October': '10', 'November': '11', 'December': '12'
        }

        dob = f"{year}-{months[month]}-{day.zfill(2)}"

        request.session.update({
            'name': name,
            'dob': dob,
            'gender': gender
        })

        return redirect('signup4')

    return render(request, 'signup3.html')


# ---------------------------
# STEP 4: SAVE USER
# ---------------------------
def signup4_view(request):
    if request.method == "POST":
        email = request.session.get('email')

        if SignupUser.objects.filter(email=email).exists():
            request.session.flush()
            return redirect('login')

        SignupUser.objects.create(
            email=email,
            password=make_password(request.session['password']),
            name=request.session['name'],
            dob=request.session['dob'],
            gender=request.session['gender'],
            marketing_opt_out=bool(request.POST.get('marketing_opt_out')),
            marketing_share=bool(request.POST.get('marketing_share')),
        )

        request.session.flush()
        return redirect('login')

    return render(request, 'signup4.html')


# ---------------------------
# PASSWORD VALIDATION
# ---------------------------
def validate_password(password):
    return (
        len(password) >= 10 and
        re.search(r'[A-Za-z]', password) and
        re.search(r'[0-9#?!&]', password)
    )


# ---------------------------
# HOME
# ---------------------------
def home(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')
    
    try:
        user = SignupUser.objects.get(id=user_id)
        return render(request, 'home.html', {'user': user})
    except SignupUser.DoesNotExist:
        request.session.flush()
        return redirect('login')


def artist_detail(request, artist_name):
    return render(request, 'artist_detail.html', {'artist_name': artist_name})


def logout_view(request):
    request.session.flush()
    return render(request, 'logout.html')
