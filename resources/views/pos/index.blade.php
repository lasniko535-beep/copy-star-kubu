@extends('layouts.app')

@section('title', 'Meja Kasir & Dasbor Manajemen - COPY STAR KUBU')

@section('content')
<div class="pos-blade-wrapper">
    <!-- Mengintegrasikan Antarmuka Kasir Interaktif POS -->
    @include('pos.main_interface')
</div>
@endsection
