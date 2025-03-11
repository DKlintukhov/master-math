/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


#include "pch.h"

#include "ExpressionGenerator.h"

namespace Core
{
    ExpressionGenerator::ExpressionGenerator(Config conf)
        : m_config{ conf }
        , m_generator{ std::random_device{}() }
        , m_intDist(conf.min, conf.max)
        , m_floatDist(0.0, 1.0)
    {
        m_ops.reserve(4);
        if (m_config.useAdd) m_ops.push_back(Operation::Add);
        if (m_config.useSub) m_ops.push_back(Operation::Sub);
        if (m_config.useMul) m_ops.push_back(Operation::Mul);
        if (m_config.useDiv) m_ops.push_back(Operation::Div);

        m_opToChar[Operation::Add] = "+";
        m_opToChar[Operation::Sub] = "-";
        m_opToChar[Operation::Mul] = "*";
        m_opToChar[Operation::Div] = "/";
    }

    std::string ExpressionGenerator::GenerateExpression()
    {
        return GenerateBinaryOperation();
    }

    std::string ExpressionGenerator::GenerateBinaryOperation()
    {
        std::stringstream ss;
        Operation op = GenerateOperation();
        double a = GenerateConstant();
        double b = GenerateConstant();

        if (op == Operation::Sub)
        {
            return NormalizeSubBinaryOperation(a, b);
        }

        if (op == Operation::Div)
        {
            return NormalizeDivBinaryOperation(a, b);
        }

        ss << std::setprecision(3) << std::noshowpoint << a;
        ss << m_opToChar[op];
        ss << std::setprecision(3) << std::noshowpoint << b;
        return ss.str();
    }

    std::string ExpressionGenerator::NormalizeSubBinaryOperation(double a, double b)
    {
        std::stringstream ss;

        if (a < b)
        {
            ss << std::setprecision(3) << std::noshowpoint << b;
            ss << m_opToChar[Operation::Sub];
            ss << std::setprecision(3) << std::noshowpoint << a;
            return ss.str();
        }

        ss << std::setprecision(3) << std::noshowpoint << a;
        ss << m_opToChar[Operation::Sub];
        ss << std::setprecision(3) << std::noshowpoint << b;
        return ss.str();
    }

    std::string ExpressionGenerator::NormalizeDivBinaryOperation(double a, double b)
    {
        if (a < b) {
            std::swap(a, b);
        }

        if (b == 0.0)
        {
            if (a == 0.0)
            {
                return ExpressionToString(Operation::Div, 0.0, static_cast<double>(m_config.max));
            }
            else
            {
                return ExpressionToString(Operation::Div, b, a);
            }
        }

        double res = a / b;
        if (std::trunc(res) == res)
        {
            return ExpressionToString(Operation::Div, a, b);
        }

        return ExpressionToString(Operation::Div, a * b, b);
    }

    double ExpressionGenerator::GenerateConstant()
    {
        if (m_config.useFloats)
        {
            return m_floatDist(m_generator) * (m_config.max - m_config.min) + m_config.min;
        }

        return static_cast<double>(m_intDist(m_generator));
    }

    Operation ExpressionGenerator::GenerateOperation()
    {
        std::uniform_int_distribution<size_t> dist(0, m_ops.size() - 1);
        return m_ops[dist(m_generator)];
    }

    std::string ExpressionGenerator::ExpressionToString(Operation op, double a, double b)
    {
        m_sstream << std::setprecision(3) << std::noshowpoint << a;
        m_sstream << m_opToChar[op];
        m_sstream << std::setprecision(3) << std::noshowpoint << b;

        std::string expr = m_sstream.str();

        m_sstream.str("");

        return expr;
    }
}
